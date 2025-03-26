import { Request, Response, Router } from 'express';
import { parseUrl } from '../utils';
import { RouteProvider, RouteProviderAccessToken } from './models';
import { getConsentUrl, getProviderAccessToken } from './providers';
import { ROUTE_PROVIDERS } from '../providers/constants';

// Cache control constants
const CACHE_CONTROL = {
  NO_STORE: 'no-store, no-cache, must-revalidate, proxy-revalidate',
  PRIVATE: 'private, no-cache, must-revalidate',
  PUBLIC: 'public, max-age=31536000, immutable',
};

const authRouter = Router();

authRouter.post('/route-provider', (req: Request, res: Response) => {
  const { url } = req.body;

  const routeURL = parseUrl(url);

  try {
    const providerName = routeURL && ROUTE_PROVIDERS[routeURL.hostname];
    const provider: RouteProvider = {
      name: providerName ?? 'file',
      consentUrl: providerName ? getConsentUrl(providerName) : undefined,
    };

    res.json(provider);
  } catch (err: Error | any) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.get(
  '/route-provider/:provider/access-token',
  async (req: Request, res: Response): Promise<void> => {
    const { provider } = req.params;
    const { code } = req.query;
    const redirectURL = new URL(
      `${process.env.FRONTEND_URL}/${process.env.FRONTEND_CONSENT_REDIRECT_PAGE}`,
    );

    // Set security headers for authentication routes
    res.set({
      'Cache-Control': CACHE_CONTROL.NO_STORE,
      'Surrogate-Control': 'no-store', // For CDNs
      Pragma: 'no-cache',
      Expires: '0',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    });

    if (!code) {
      res.redirect(302, `${redirectURL.toString()}?auth=false`);
      return;
    }

    try {
      const accessToken: RouteProviderAccessToken = await getProviderAccessToken(
        provider,
        code as string,
      );

      if (!accessToken.success) {
        return res.redirect(302, `${redirectURL.toString()}?auth=false`);
      }

      // Get the actual host from X-Forwarded-Host header
      const forwardedHost = req.get('X-Forwarded-Host');
      // Extract domain from forwarded host or fall back to request host
      const domain = forwardedHost || req.get('host');

      // Common cookie options
      const cookieOptions = {
        expires: new Date(Date.now() + accessToken.tokens.expiresIn * 1000),
        domain,
        path: '/',
        secure: redirectURL.protocol === 'https:', // Required for __Secure- prefix
        sameSite: 'strict' as const, // Use strict when behind Google Frontend
        httpOnly: true,
      };

      res.cookie('__Secure-session', accessToken.tokens.accessToken, cookieOptions);

      res.cookie('__Secure-authed', '/', {
        ...cookieOptions,
        httpOnly: false,
      });

      // Set additional headers for redirect
      res.set({
        Vary: 'Cookie, Accept-Encoding', // Important when response varies based on cookies
        'Clear-Site-Data': '"cookies", "storage"', // Clear old data on new auth
      });

      console.log(res.getHeaders());

      res.status(302).location(`${redirectURL.toString()}?auth=true`).send();
    } catch {
      res.redirect(302, `${redirectURL.toString()}?auth=false`);
    }
  },
);

export default authRouter;
