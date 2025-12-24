const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

export const cacheKey = (path, query) => {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

export const getCached = (key) => {
  const now = Date.now();
  const item = cache.get(key);
  if (!item) return null;
  if (now - item.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

export const setCached = (key, data) =>
  cache.set(key, { ts: Date.now(), data });
