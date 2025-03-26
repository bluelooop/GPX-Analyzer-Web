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

      if (!accessToken.success) {
        return res.redirect(302, `${redirectURL.toString()}?auth=false`);
      }

      res.cookie('__Secure-session', accessToken.tokens.accessToken, {
        expires: new Date(Date.now() + accessToken.tokens.expiresIn * 1000),
        path: '/',
        domain: '.run.app',
        httpOnly: true,
        secure: redirectURL.protocol === 'https:',
        sameSite: 'none',
      });

      res.cookie('__Secure-authed', '/', {
        expires: new Date(Date.now() + accessToken.tokens.expiresIn * 1000),
        path: '/',
        domain: '.run.app',
        httpOnly: false,
        secure: redirectURL.protocol === 'https:',
        sameSite: 'none',
      });

      console.log(res.getHeaders());

      res.status(302).location(`${redirectURL.toString()}?auth=true`).send();
    } catch {
      res.redirect(302, `${redirectURL.toString()}?auth=false`);
    }
  },
);

export default authRouter;
