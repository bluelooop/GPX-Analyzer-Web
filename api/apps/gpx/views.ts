import { Router } from 'express';
import { analyseRoute } from './analyzer';
import { GPXRoute } from './models';
import { routeProviderTokenMiddleware } from './middlewares';
import { getRequiredAuthorizationToken } from '../utils';

const gpxRouter = Router();

// @ts-ignore
gpxRouter.post('/analyze', routeProviderTokenMiddleware, (req, res) => {
  const { url } = req.body;
  const segmentCount = parseInt(req.query.segments as string, 10);

  try {
    const routeProviderToken = getRequiredAuthorizationToken(req.headers);

    analyseRoute(url, { segmentCount, routeProvider: { token: routeProviderToken } })
      .then((result: GPXRoute[]) => res.json(result))
      .catch((err: any) => res.status(400).json({ message: err.message }));
  } catch (err: Error | any) {
    res.status(400).json({ message: err.message });
  }
});

export default gpxRouter;
