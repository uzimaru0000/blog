import NextHead from 'next/head';
import twemoji from 'twemoji';

export const Head: React.VFC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <NextHead>
      <title>{"uzimaru's blog"}</title>
      <meta name="description" content="うじまるのブログ" />
      <link rel="icon" href={fabicon} />
      {children}
    </NextHead>
  );
};

const fabicon = `https://twemoji.maxcdn.com/v/latest/svg/${twemoji.convert.toCodePoint(
  '🐣'
)}.svg`;
