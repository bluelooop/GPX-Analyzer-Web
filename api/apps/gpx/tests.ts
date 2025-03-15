// @ts-ignore
import { beforeAll, describe, expect, test } from '@jest/globals';
import { analyseRoute } from './analyzer';
import { loadConfigurations, loadConfigurationsForTests } from '../../configurations';
import { GPXRoute } from './models';

describe('GPX Analyzer', () => {
  beforeAll(() => {
    loadConfigurations();
    loadConfigurationsForTests(__dirname);
  });

  test('Analise route using Strava URL', async () => {
    const url = 'https://www.strava.com/routes/123';
    const routeProviderToken = process.env.STRAVA_ACCESS_TOKEN;
    const segmentCount = 5;

    try {
      const routes = await analyseRoute(url, { segmentCount, routeProviderToken });

      expect(routes).toBeInstanceOf(Array<GPXRoute>);

      routes.forEach((route) => {
        expect(route.name).toBeDefined();
        expect(route.name).not.toBe('');
        expect(route.name).not.toBeNull();

        expect(route.distance).toBeDefined();

        expect(route.segments.length).toBeGreaterThan(0);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      expect(err).not.toBeDefined();
    }
  });
});
