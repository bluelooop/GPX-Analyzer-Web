import { PythonShell } from 'python-shell';
import { GPXRoute } from './models';
import { convertToCamelCase, parseUrl } from '../utils';
import {
  ELEVATION_PROVIDER_VARIABLE_KEYS,
  ROUTE_PROVIDER_VARIABLE_KEYS,
} from '../providers/constants';

interface AnaliseRouteOptions {
  segmentCount: number;
  routeProvider?: {
    token: string;
  };
  elevationProvider?: {
    name: string;
    token: string;
  };
}

/**
 * Retrieves environment variables based on the provided URL or file and options.
 *
 * Depending on the input `urlOrFile` and the specified `options`, this function performs the following:
 * - If the input is a URL and matches one of the known route provider keys, it adds the corresponding
 *   environment variable for the route provider.
 * - If an elevation provider is specified in the options, it adds the corresponding environment variable
 *   for the elevation provider.
 *
 * @param urlOrFile - A string that can be a URL or a file path.
 *   - If it's a valid URL, the function uses it to look up route-related environment variables.
 *   - Otherwise, this value is ignored for route provider lookup.
 * @param options - A partial object of `AnaliseRouteOptions` that may include:
 *   - `segmentCount`: The count of segment to split the analysis.
 *   - `routeProviderToken`: The token for specific route providers.
 *   - `elevationProvider`: An object defining the elevation provider and its required token.
 *
 * @returns A record of environment variables required for specific route or elevation services.
 * - Key-value pairs where keys are environment variable names, and values are their respective tokens.
 *
 * Example:
 * ```typescript
 * const variables = getEnvironmentVariables(
 *   'https://www.strava.com',
 *   { routeProviderToken: 'myStravaToken', elevationProvider: { name: 'google', token: 'myGoogleToken' } }
 * );
 * console.log(variables);
 * // Output: {STRAVA_ACCESS_KEY: 'myStravaToken', GOOGLE_ELEVATION_API_KEY: 'myGoogleToken' }
 * ```
 */
const getEnvironmentVariables = (
  urlOrFile: string,
  options: Partial<AnaliseRouteOptions>,
): Record<string, string> => {
  const environmentVariables: Record<string, string> = {};

  const routeURL = parseUrl(urlOrFile);

  if (routeURL) {
    const routeProviderVariableKey = ROUTE_PROVIDER_VARIABLE_KEYS[routeURL.host];

    if (routeProviderVariableKey) {
      environmentVariables[routeProviderVariableKey] = options.routeProvider?.token ?? '';
    }
  }

  if (options.elevationProvider) {
    const elevationProviderVariableKey =
      ELEVATION_PROVIDER_VARIABLE_KEYS[options.elevationProvider?.name];

    if (elevationProviderVariableKey) {
      environmentVariables[elevationProviderVariableKey] = options.elevationProvider?.token ?? '';
    }
  }

  return environmentVariables;
};

/**
 * Analyzes a specific route based on the input URL or file and the provided options.
 *
 * This function utilizes a Python script to process the route data, splits it into
 * the given number of segments, and retrieves its details as `GPXRoute` objects.
 * It dynamically sets up the required environment variables for route and elevation
 * providers.
 *
 * @param urlOrFile - A string representing the input route data, which can be:
 *   - A URL pointing to a route (e.g., Strava URL).
 *   - A file path to a locally stored route file.
 *
 * @param segmentCount
 * @param options - An object of type `AnaliseRouteOptions` that specifies:
 *   - `segmentCount`: The number of segments to divide the route into (default: 1).
 *   - `routeProviderToken`: The API token of the route provider.
 *     Example: Access token for Strava.
 *   - `elevationProvider`: Object specifying the elevation provider, structured as:
 *     - `name`: The name of the elevation provider (e.g., "google").
 *     - `token`: The access token for the elevation provider APIs.
 *
 * @returns A promise that resolves to an array of `GPXRoute` objects:
 * - Each `GPXRoute` contains the processed route segments with the necessary details.
 * - The result is converted to camelCase for consistent JavaScript naming conventions.
 *
 * @throws If the Python script fails to execute or returns invalid data, an error will be thrown.
 *
 * Example:
 * ```typescript
 * const routes = await analyseRoute('https://strava.com/route/1234', {
 *   segmentCount: 5,
 *   routeProviderToken: 'stravaAccessToken',
 *   elevationProvider: { name: 'google', token: 'googleElevationToken' },
 * });
 * console.log(routes);
 * ```
 */
export const analyseRoute = async (
  urlOrFile: string,
  { segmentCount = 1, ...options }: AnaliseRouteOptions,
): Promise<GPXRoute[]> => {
  const environmentVariables = getEnvironmentVariables(urlOrFile, options);

  const pythonCallOptions = {
    pythonPath: process.env.PYTHON_PATH ?? 'python',
    pythonOptions: ['-u'], // unbuffered output
    args: [urlOrFile, '-l', String(segmentCount), '-o', 'stdout'],
    env: environmentVariables,
  };

  try {
    // @ts-ignore
    const results = await PythonShell.run(process.env.GPX_ANALYZER_SCRIPT_PATH, pythonCallOptions);

    const firstDataIndex = results.findIndex((result) => result === '[');
    const lastDataIndex = results.findIndex((result_1) => result_1 === ']');
    const data = results.slice(firstDataIndex, lastDataIndex + 1).join('');

    return convertToCamelCase<GPXRoute[]>(JSON.parse(data));
  } catch {
    throw new Error("Couldn't analyze route. Please check your input and try again");
  }
};
