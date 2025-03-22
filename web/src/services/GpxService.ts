import { getAPIUrl } from './utils.ts';
import { AiGpxSegmentDescription, GPXRoute, GPXSegment } from '../models.ts';

const ROUTES = {
  analyze: 'gpx/analyze',
  aiExplanation: 'gpx/ai-explanation',
};

const GpxService = {
  analyze: async (routeURL: URL, splitBy: number): Promise<GPXRoute> => {
    const url = getAPIUrl(`${ROUTES.analyze}?segments=${splitBy}`);
    try {
      const response = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: routeURL.toString() }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Promise.reject(new Error(data.message));
      }

      return data[0] as GPXRoute;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  aiExplain: async (gpxSegment: GPXSegment): Promise<AiGpxSegmentDescription> => {
    const url = getAPIUrl(ROUTES.aiExplanation);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ segment: gpxSegment }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Promise.reject(new Error(data.message));
      }

      return data as AiGpxSegmentDescription;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default GpxService;
