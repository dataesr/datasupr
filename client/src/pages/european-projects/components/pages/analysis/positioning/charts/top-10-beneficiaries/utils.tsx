export function getDefaultParams(searchParams) {
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join('&');
  return params + '&stage=successful';
}