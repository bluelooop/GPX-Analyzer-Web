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
