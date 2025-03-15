import { Router } from 'express';
import { analyseRoute } from './analyzer';
import { GPXRoute } from './models';

const gpxRouter = Router();

gpxRouter.post('/analyze', (req, res) => {
  const { url, segmentCount, routeProviderToken } = req.body;

  analyseRoute(url, { segmentCount, routeProviderToken })
    .then((result: GPXRoute[]) => res.json(result))
    .catch((err: any) => res.status(400).json({ message: err.message }));
});

export default gpxRouter;
