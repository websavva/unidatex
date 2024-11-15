export interface CreateLinkOptions {
  query?: Record<string, any>;
  hash?: string;
}

export const createUrl = (
  path: string,
  { query = {}, hash }: CreateLinkOptions = {},
) => {
  const url = new URL(path, import.meta.env.UNDX_BASE_URL);

  for (const [paramName, paramValue] of Object.entries(query)) {
    if (paramValue === null || paramValue === undefined) continue;

    url.searchParams.set(paramName, paramValue);
  }

  if (hash) url.hash;

  return url.toString();
};
