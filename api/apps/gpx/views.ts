import { Router } from 'express';
import { analyseRoute } from './analyzer';
import { GPXRoute } from './models';

const gpxRouter = Router();

gpxRouter.post('/analyze', (req, res) => {
  const { url } = req.body;
  const { segments, routeProviderToken } = req.query;
  const segmentCount = parseInt(segments as string, 10);

  analyseRoute(url, { segmentCount, routeProviderToken: routeProviderToken as string })
    .then((result: GPXRoute[]) => res.json(result))
    .catch((err: any) => res.status(400).json({ message: err.message }));
});

export default gpxRouter;
