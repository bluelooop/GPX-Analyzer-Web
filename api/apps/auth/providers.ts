import axios from 'axios';
import { RouteProviderAccessToken } from './models';

const CONSENT_URLS: Record<string, CallableFunction> = {
  strava: (): string => {
    const clientID = process.env.STRAVA_CLIENT_ID;
    const redirectURI = process.env.STRAVA_REDIRECT_URI;

    if (!clientID || !redirectURI) {
      throw new Error('Strava client ID or redirect URI not set');
    }

    return `https://www.strava.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=activity:read`;
  },
};

const ACCESS_TOKENS: Record<string, CallableFunction> = {
  strava: (authorizationCode: string): Promise<RouteProviderAccessToken> => {
    const clientID = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;

    if (!clientID || !clientSecret) {
      return Promise.reject(new Error('Strava client ID or secret not set'));
    }

    // Exchange the authorization code for an access token
    return axios
      .post('https://www.strava.com/oauth/token', {
        client_id: clientID,
        client_secret: clientSecret,
        code: authorizationCode,
        grant_type: 'authorization_code',
      })
      .then((response) => {
        const { access_token, refresh_token, token_type, expires_at, expires_in } = response.data;

        const data: RouteProviderAccessToken = {
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

        return data;
      })
      .catch((error) => {
        console.error('Token exchange error:', error);
        return Promise.reject(new Error('Failed to exchange authorization code for access token'));
      });
  },
};

export const getConsentUrl = (provider: string): string => {
  if (!CONSENT_URLS[provider]) {
    throw new Error(`Consent URL for provider ${provider} not found`);
  }

  return CONSENT_URLS[provider]();
};

export const getProviderAccessToken = (
  provider: string,
  authorizationCode: string,
): Promise<RouteProviderAccessToken> => {
  if (!ACCESS_TOKENS[provider]) {
    return Promise.reject(new Error(`Access token method for provider ${provider} not found`));
  }

  return ACCESS_TOKENS[provider](authorizationCode);
};
