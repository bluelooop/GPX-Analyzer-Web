import { RouteProviderAccessToken } from './models';
import axios from 'axios';

export const CONSENT_URLS: Record<string, CallableFunction> = {
  strava: (): string => {
    const clientID = process.env.STRAVA_CLIENT_ID;
    const redirectURI = `${process.env.STRAVA_REDIRECT_HOST}/${process.env.STRAVA_REDIRECT_PATH}`;

    if (!clientID || !redirectURI) {
      throw new Error('Strava client ID or redirect URI not set');
    }

    return `https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=read_all`;
  },
};

export const ACCESS_TOKENS: Record<string, CallableFunction> = {
  strava: async (authorizationCode: string): Promise<RouteProviderAccessToken> => {
    const clientID = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;

    if (!clientID || !clientSecret) {
      return Promise.reject(new Error('Strava client ID or secret not set'));
    }

    // Exchange the authorization code for an access token
    try {
      const response = await axios.post('https://www.strava.com/oauth/token', {
        client_id: clientID,
        client_secret: clientSecret,
        code: authorizationCode,
        grant_type: 'authorization_code',
      });
      const { access_token, refresh_token, token_type, expires_at, expires_in } = response.data;

      return {
        success: true,
        message: 'Authorization successful',
        provider: 'strava',
        tokens: {
          accessToken: access_token,
          type: token_type,
          expiresAt: expires_at,
          expiresIn: expires_in,
          refreshToken: refresh_token,
        },
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new Error('Failed to exchange authorization code for access token');
    }
  },
};
