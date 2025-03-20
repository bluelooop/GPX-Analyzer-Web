import { useMemo } from 'react';

/**
 * A custom React hook for extracting query parameters from the current URL.
 *
 * This hook parses the URL's query string and returns the parameters as a record of key-value pairs.
 * It uses `useMemo` to memoize the result, ensuring the object does not change
 * unless the query string itself changes.
 *
 * @returns {Record<string, string>} An object containing the query parameters as key-value pairs.
 *
 * @example
 * // If the current URL is: http://example.com?foo=bar&baz=qux
 * const queryParams = useQueryParams();
 * console.log(queryParams); // { foo: "bar", baz: "qux" }
 */
export const useQueryParams = (): Record<string, string> => {
  return useMemo((): Record<string, string> => {
    const params = new URLSearchParams(window.location.search);

    return Object.fromEntries(params.entries());
  }, []);
};
