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
  async (req: Request, res: Response): Promise<Response | any> => {
    const { provider } = req.params;
    const { code } = req.query;
    const redirectURL = new URL(
      `${process.env.FRONTEND_URL}/${process.env.FRONTEND_CONSENT_REDIRECT_PAGE}`,
    );

    if (!code) {
      return res.redirect(`${redirectURL.toString()}?auth=false`);
    }

    try {
      const accessToken: RouteProviderAccessToken = await getProviderAccessToken(
        provider,
        code as string,
      );

      if (!accessToken.success) {
        return res.redirect(`${redirectURL.toString()}?auth=false`);
      }

      res.cookie('_rpat', accessToken.tokens.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + accessToken.tokens.expiresIn * 1000),
        secure: redirectURL.protocol === 'https:',
        domain: `.${redirectURL.hostname}`,
      });

      return res.redirect(`${redirectURL.toString()}?auth=${accessToken.tokens.expiresIn}`);
    } catch {
      return res.redirect(`${redirectURL.toString()}?auth=false`);
    }
  },
);

export default authRouter;
