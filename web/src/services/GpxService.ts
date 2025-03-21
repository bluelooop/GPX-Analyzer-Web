import { getAPIUrl } from './utils.ts';
import { GPXRoute } from '../models.ts';

const ROUTES = {
  analyze: 'gpx/analyze',
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
};

export default GpxService;
