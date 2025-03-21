import { Router } from 'express';
import { analyseRoute } from './analyzer';
import { GPXRoute } from './models';

const gpxRouter = Router();

// @ts-ignore
gpxRouter.post('/analyze', (req, res) => {
  const { url } = req.body;
  const segmentCount = parseInt(req.query.segments as string, 10);
  const routeProviderToken: string = req.cookies._rpat;

  if (!routeProviderToken) {
    return res.status(400).json({ message: 'Route provider token not set' });
  }

  analyseRoute(url, { segmentCount, routeProvider: { token: routeProviderToken } })
    .then((result: GPXRoute[]) => res.json(result))
    .catch((err: any) => res.status(400).json({ message: err.message }));
});

export default gpxRouter;
