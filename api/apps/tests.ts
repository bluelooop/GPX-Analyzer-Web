import { describe, expect, test } from '@jest/globals';
import { isValidUrl, parseUrl } from './utils';

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
