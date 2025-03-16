export const ROUTE_PROVIDERS: Record<string, string> = {
  'strava.com': 'strava',
  'www.strava.com': 'strava',

  'garmin.com': 'garmin',
  'www.garmin.com': 'garmin',
};

export const ROUTE_PROVIDER_VARIABLE_KEYS: Record<string, string> = {
  'strava.com': 'STRAVA_ACCESS_KEY',
  'www.strava.com': 'STRAVA_ACCESS_KEY',
};

export const ELEVATION_PROVIDER_VARIABLE_KEYS: Record<string, string> = {
  google: 'GOOGLE_ELEVATION_API_KEY',
};
