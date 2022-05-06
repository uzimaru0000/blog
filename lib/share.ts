export const ORIGIN = 'https://blog.uzimaru.com';

export const twitter = (path: string, text: string) => {
  const url = new URL('/intent/tweet', 'https://twitter.com');
  url.searchParams.set('url', new URL(path, ORIGIN).href);
  url.searchParams.set('text', `${text} - uzimaru's blog`);

  return url.href;
};

export const hatena = (path: string, text: string) => {
  const url = new URL(`/add`, 'https://b.hatena.ne.jp');
  url.searchParams.set('mode', 'confirm');
  url.searchParams.set('title', text);
  url.searchParams.set('url', new URL(path, ORIGIN).href);

  return url.href;
};

export const pocket = (path: string) => {
  const url = new URL(`/save`, 'https://getpocket.com');
  url.searchParams.set('url', new URL(path, ORIGIN).href);

  return url.href;
};
