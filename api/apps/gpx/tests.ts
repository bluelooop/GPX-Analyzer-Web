// @ts-ignore
import { beforeAll, describe, expect, test } from '@jest/globals';
import { analyseRoute } from './analyzer';
import { isValidUrl, parseUrl } from './utils';
import { loadConfigurations, loadConfigurationsForTests } from '../../configurations';
import { GPXRoute } from './models';

describe('GPX Analyzer', () => {
  beforeAll(() => {
    loadConfigurations();
    loadConfigurationsForTests(__dirname);
  });

  test('Analise route using Strava URL', async () => {
    const url = 'https://www.strava.com/routes/123';
    const providerToken = process.env.STRAVA_ACCESS_TOKEN;
    const segmentCount = 5;

    try {
      const routes = await analyseRoute(url, { segmentCount, providerToken });

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

describe('URL Validation', () => {
  describe('isValidUrl', () => {
    test('should return true for valid http URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=123')).toBe(true);
    });

    test('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });
  });

  describe('parseUrl', () => {
    test('should return URL object for valid URLs', () => {
      const url = 'https://example.com/path?query=123';
      const parsed = parseUrl(url);

      expect(parsed).toBeInstanceOf(URL);
      expect(parsed?.href).toBe(url);
      expect(parsed?.hostname).toBe('example.com');
      expect(parsed?.pathname).toBe('/path');
      expect(parsed?.searchParams.get('query')).toBe('123');
    });

    test('should return null for invalid URLs', () => {
      expect(parseUrl('not-a-url')).toBeNull();
      expect(parseUrl('')).toBeNull();
      expect(parseUrl('ftp://example.com')).toBeNull();
    });
  });
});
