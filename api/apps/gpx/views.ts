import { Router } from 'express';
import { analyseRoute } from './analyzer';
import { GPXRoute } from './models';
import { AI_SERVICES } from '../ai/services';

const gpxRouter = Router();

// @ts-ignore
gpxRouter.post('/analyze', (req, res) => {
  const { url } = req.body;
  const segmentCount = parseInt(req.query.segments as string, 10);
  const routeProviderToken: string = req.cookies['__Secure-session'];

  if (!routeProviderToken) {
    return res.status(400).json({ message: 'Route provider token not set' });
  }

  analyseRoute(url, { segmentCount, routeProvider: { token: routeProviderToken } })
    .then((result: GPXRoute[]) => res.json(result))
    .catch((err: any) => res.status(400).json({ message: err.message }));
});

gpxRouter.post('/ai-explanation', async (req, res): Promise<Response | any> => {
  const { segment } = req.body;

  if (!segment) {
    return res.status(400).json({ message: 'Segment not set' });
  }

  try {
    const description = await AI_SERVICES.claude(segment);
    const aiGpxDescription = { segmentNumber: segment.number, description };

    res.json(aiGpxDescription);
  } catch {
    res.status(400).json({ message: 'Failed to generate AI description' });
  }
});

export default gpxRouter;
