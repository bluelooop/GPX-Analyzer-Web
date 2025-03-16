import { getConsentUrl } from './providers';

describe('getConsentUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules(); // Reset modules to avoid caching
    process.env = { ...originalEnv }; // Copy original environment variables
  });

  afterEach(() => {
    process.env = originalEnv; // Restore original environment variables
  });

  it('should return the correct Strava consent URL when environment variables are set', () => {
    process.env.STRAVA_CLIENT_ID = 'test_client_id';
    process.env.STRAVA_REDIRECT_URI = 'https://test-redirect-uri.com';

    const result = getConsentUrl('strava');

    expect(result).toBe(
      'https://www.strava.com/oauth/authorize?client_id=test_client_id&redirect_uri=https://test-redirect-uri.com&response_type=code&scope=activity:read',
    );
  });

  it('should throw an error if STRAVA_CLIENT_ID is not set', () => {
    process.env.STRAVA_CLIENT_ID = '';
    process.env.STRAVA_REDIRECT_URI = 'https://test-redirect-uri.com';

    expect(() => getConsentUrl('strava')).toThrow('Strava client ID or redirect URI not set');
  });

  it('should throw an error if STRAVA_REDIRECT_URI is not set', () => {
    process.env.STRAVA_CLIENT_ID = 'test_client_id';
    process.env.STRAVA_REDIRECT_URI = '';

    expect(() => getConsentUrl('strava')).toThrow('Strava client ID or redirect URI not set');
  });
});
