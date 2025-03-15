import { Router } from 'express';
import { parseUrl } from '../utils';
import { RouteProvider } from './models';

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
  const provider: RouteProvider = {
    name: (routeURL && ROUTE_PROVIDERS[routeURL.hostname]) ?? 'file',
  };

  res.json(provider);
});

authRouter.get('/route-provider-consent', (req, res) => {
  const { provider } = req.query;
});

export default authRouter;
