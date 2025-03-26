/**
 * Array of regular expression patterns to validate Strava route URLs.
 * Each pattern is designed to match URLs that follow the format:
 * - `http://www.strava.com/routes/<ID>`
 * - `https://www.strava.com/routes/<ID>`
 */
const routeURLS = [/http(s)?:\/\/www.strava.com\/routes\/[0-9]/g];

/**
 * Validates whether a given URL string is a valid Strava route URL.
 *
 * @param url - The URL string to validate.
 *
 * @returns `true` if the URL is both a valid general URL and matches the Strava route patterns defined in `routeURLS`, otherwise `false`.
 */
export const isValidRouteURL = (url: string): boolean => {
  return isValidURL(url) && routeURLS.some((routeURL) => url.match(routeURL));
};

/**
 * Validates whether a given string is a valid URL.
 *
 * @param url - The URL string to validate.
 *
 * @returns `true` if the string is a valid URL format, otherwise `false`.
 *
 * @remarks The method attempts to construct a `URL` object and catches any errors that indicate invalid URL formatting.
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Retrieves the value of a specified cookie by its name.
 *
 * @param name - The name of the cookie to retrieve.
 *
 * @returns The value of the cookie as a string, or `null` if the cookie is not found.
 *
 * @remarks This function searches through the document's `cookie` property,
 * which contains all cookies available to the current document, and attempts
 * to locate a cookie with the specified name. If found, it will decode and
 * return its value; otherwise, it returns `null`.
 *
 * @example
 * // Assuming a cookie `user=JohnDoe` is present:
 * const user = getCookie('user');
 * console.log(user); // Outputs: "JohnDoe"
 *
 * @example
 * // If the cookie is not present:
 * const session = getCookie('session');
 * console.log(session); // Outputs: null
 */
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};
