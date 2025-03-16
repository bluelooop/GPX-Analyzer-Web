import { RouteProviderAccessToken } from './models';
import { ACCESS_TOKENS, CONSENT_URLS } from './services';

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
