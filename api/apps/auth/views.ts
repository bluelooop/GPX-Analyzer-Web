import { Request, Response, Router } from 'express';
import { parseUrl } from '../utils';
import { RouteProvider, RouteProviderAccessToken } from './models';
import { getConsentUrl, getProviderAccessToken } from './providers';
import { ROUTE_PROVIDERS } from '../providers/constants';

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

    if (!code) {
      res.redirect(302, `${redirectURL.toString()}?auth=false`);
      return;
    }

    try {
      const accessToken: RouteProviderAccessToken = await getProviderAccessToken(
        provider,
        code as string,
      );

      // const accessToken = {
      //   success: true,
      //   message: 'Authorization successful',
      //   provider: 'strava',
      //   tokens: {
      //     accessToken: '1234567890',
      //     type: 'Bearer',
      //     expiresAt: new Date().getTime() + 3600 * 10000,
      //     expiresIn: new Date().getTime() + 3600 * 10000,
      //     refreshToken: '1234567890',
      //   },
      // };

      if (!accessToken.success) {
        return res.redirect(302, `${redirectURL.toString()}?auth=false`);
      }

      // Common cookie options
      const cookieOptions = {
        expires: new Date(Date.now() + accessToken.tokens.expiresIn * 1000),
        path: '/',
        httpOnly: true,
        secure: redirectURL.protocol === 'https:',
      };

      res.cookie('__Secure-session', accessToken.tokens.accessToken, cookieOptions);

      res.cookie('__Secure-authed', '/', { ...cookieOptions, httpOnly: false });

      console.log(res.getHeaders());

      res.status(302).location(`${redirectURL.toString()}?auth=true`).send();
    } catch {
      res.redirect(302, `${redirectURL.toString()}?auth=false`);
    }
  },
);

export default authRouter;
