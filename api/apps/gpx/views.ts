import { Router } from 'express';
import { analyseRoute } from './analyzer';
import { AiGpxSegmentDescription, GPXRoute, GPXSegment } from './models';
import { AI_SERVICES } from '../ai/services';

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

gpxRouter.post('/ai-explanation/segments', (req, res): Response | any => {
  const { segments } = req.body;

  if (!segments) {
    return res.status(400).json({ message: 'Segments not set' });
  }

  if (!Array.isArray(segments)) {
    return res.status(400).json({ message: 'Segments must be an array of GPX segments' });
  }

  const aiExplanation = (segments as GPXSegment[]).map(
    async (segment): Promise<AiGpxSegmentDescription> => {
      const description = await AI_SERVICES.claude(segment);

      return { segmentNumber: segment.number, description };
    },
  );

  Promise.all(aiExplanation)
    .then((aiGpxDescriptions) => res.json(aiGpxDescriptions))
    .catch(() => res.status(400).json({ message: 'Failed to generate AI description' }));
});

gpxRouter.post('/ai-explanation/segment', async (req, res): Promise<Response | any> => {
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
