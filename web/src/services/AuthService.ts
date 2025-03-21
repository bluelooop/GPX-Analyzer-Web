import { RouteProvider } from '../models.ts';
import { getAPIUrl } from './utils.ts';

const ROUTES = {
  routeProvider: 'auth/route-provider',
};

const AuthService = {
  routeProvider: async (routeURL: string): Promise<RouteProvider> => {
    const url = getAPIUrl(ROUTES.routeProvider);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: routeURL }),
      });

      const data = await response.json();

      if (!response.ok) {
        return Promise.reject(new Error(data.message));
      }

      return data as RouteProvider;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default AuthService;
