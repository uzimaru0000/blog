import NextHead from 'next/head';
import twemoji from 'twemoji';
import { ogp } from '../lib/ogp';

export const Head: React.VFC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <NextHead>
      <title>{"uzimaru's blog"}</title>
      <meta
        name="description"
        content="うじまるのブログです。技術的なことや日常的なことを書いていきます。"
      />
      <link rel="icon" href={fabicon} />
      {children}
    </NextHead>
  );
};

export const OGTag = ({
  url = 'https://blog.uzimaru.com',
  type = 'website',
  title,
  description = 'うじまるのブログです。技術的なことや日常的なことを書いていきます。',
}: {
  url?: string;
  type?: 'website' | 'article';
  title?: string;
  description?: string;
}) => {
  return (
    <NextHead>
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || 'うじまるのブログ'} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="uzimaru's blog" />
      <meta
        property="og:image"
        content={title ? ogp(title) : 'https://blog.uzimaru.com/ogp.png'}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
    </NextHead>
  );
};

const fabicon = `https://twemoji.maxcdn.com/v/latest/svg/${twemoji.convert.toCodePoint(
  '🐣'
)}.svg`;
