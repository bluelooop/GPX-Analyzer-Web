import { Router } from 'express';
import { analyseRoute } from './analyzer';
import { GPXRoute } from './models';
import { tokenMiddleware } from './middlewares';
import { getAuthorizationToken } from '../utils';

const gpxRouter = Router();

// @ts-ignore
gpxRouter.post('/analyze', tokenMiddleware, (req, res) => {
  const { url } = req.body;
  const { segments } = req.query;
  const segmentCount = parseInt(segments as string, 10);
  const routeProviderToken = getAuthorizationToken(req.headers);

  analyseRoute(url, { segmentCount, routeProviderToken })
    .then((result: GPXRoute[]) => res.json(result))
    .catch((err: any) => res.status(400).json({ message: err.message }));
});

export default gpxRouter;
