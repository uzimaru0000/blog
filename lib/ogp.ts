const BASE = 'https://blog.uzimaru.com';

export const ogp = (title: string) => {
  const url = new URL('/api/ogp', BASE);
  url.searchParams.set('title', title);

  return url.href;
};
