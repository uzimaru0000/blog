import NextHead from 'next/head';
import twemoji from 'twemoji';

export const Head: React.VFC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <NextHead>
      <title>{"uzimaru's blog"}</title>
      <meta name="description" content="うじまるのブログ" />
      <meta property="og:url" content="https://blog.uzimaru.com" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="うじまるのブログ" />
      <meta
        property="og:description"
        content="うじまるのブログです。技術的なことや日常的なことを書いていきます。"
      />
      <meta property="og:site_name" content="uzimaru's blog" />
      <meta property="og:image" content="https://blog.uzimaru.com/ogp.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" href={fabicon} />
      {children}
    </NextHead>
  );
};

const fabicon = `https://twemoji.maxcdn.com/v/latest/svg/${twemoji.convert.toCodePoint(
  '🐣'
)}.svg`;
