const BASE = 'https://blog-ogp.uzimaru.com';

export const ogp = (title: string) => {
  const url = new URL('/ogp', BASE);
  url.searchParams.set('title', title);

  return url.href;
};
