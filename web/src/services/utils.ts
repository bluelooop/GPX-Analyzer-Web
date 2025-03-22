// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
export const getAPIUrl = (relativeURL: string): string =>
  `${import.meta.env.VITE_API_URL}/api/${relativeURL}`;
