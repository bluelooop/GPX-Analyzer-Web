const toCamelCase = (str: string): string =>
  str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Converts the keys of an object (or an array of objects) to camelCase.
 *
 * - If the input is an array, this function will recursively convert all objects in the array.
 * - If the input is an object, this function will convert all its keys to camelCase.
 * - If the input is not an object or an array, it will return the input as is.
 *
 * @template T The type of the returned object or array.
 * @param obj The input object, array, or value to be converted.
 * @returns A new object, array, or the input value with keys converted to camelCase.
 */
export const convertToCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCase(item)) as any;
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};

    Object.keys(obj).forEach((key) => {
      const camelKey = toCamelCase(key);
      newObj[camelKey] = convertToCamelCase(obj[key]);
    });

    return newObj;
  }

  return obj;
};

/**
 * Checks if a given string is a valid URL and uses either the `http` or `https` protocol.
 *
 * @param urlString - The string to be checked for validity as a URL.
 * @returns {boolean} - `true` if the string is a valid URL with `http` or `https` protocol, otherwise `false`.
 *
 * @example
 * ```typescript
 * const isValid = isValidUrl('https://example.com'); // returns true
 * const isValid2 = isValidUrl('ftp://example.com');  // returns false
 * const isValid3 = isValidUrl('invalid-url');        // returns false
 * ```
 */
export const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    // Check if protocol is http or https
    return url.protocol === 'http:' || url.protocol === 'https:';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

/**
 * Parses a given string into a URL object if it is a valid URL with either the `http` or `https` protocol.
 *
 * @param urlString - The string to be parsed into a URL object.
 * @returns {URL | null} - Returns a `URL` object if the string is a valid URL with `http` or `https` protocol. Returns `null` otherwise.
 *
 * @example
 * ```typescript
 * const url = parseUrl('https://example.com');
 * if (url) {
 *   console.log(url.hostname); // Outputs: example.com
 * }
 *
 * const invalidUrl = parseUrl('ftp://example.com'); // Returns null
 * const invalidUrl2 = parseUrl('invalid-url');     // Returns null
 * ```
 */
export const parseUrl = (urlString: string): URL | null => {
  try {
    const url = new URL(urlString);
    if (isValidUrl(urlString)) {
      return url;
    }
    return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};
