import { Router } from 'express';
import { parseUrl } from '../utils';
import { RouteProvider, RouteProviderAccessToken } from './models';
import { getConsentUrl, getProviderAccessToken } from './providers';

const authRouter = Router();

const ROUTE_PROVIDERS: Record<string, string> = {
  'strava.com': 'strava',
  'www.strava.com': 'strava',

  'garmin.com': 'garmin',
  'www.garmin.com': 'garmin',
};

authRouter.post('/route-provider', (req, res) => {
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

authRouter.get('/route-provider/:provider/access-token', (req, res): any => {
  const { provider } = req.params;
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is missing' });
  }

  getProviderAccessToken(provider, code as string)
    .then((token: RouteProviderAccessToken) => res.json(token))
    .catch((err: Error | any) => res.status(400).json({ message: err.message }));
});

export default authRouter;
