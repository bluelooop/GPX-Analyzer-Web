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

      if (!response.ok) {
        return { name: '' };
      }

      const data = await response.json();

      return {
        name: data.name,
        consentUrl: data?.consentUrl,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default AuthService;
