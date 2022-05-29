import { Box, Center } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { BlockObject } from '../../lib/notion/types';

type KnownURL = 'twitter' | 'gist' | 'codepen';

type TypedURL = {
  type: KnownURL;
  url: URL;
};

const isTwitter = (x: URL) => {
  return x.host === 'twitter.com';
};

const isGist = (x: URL) => {
  return x.host === 'gist.github.com';
};

const isCodePen = (x: URL) => {
  return x.host === 'codepen.io';
};

const typedUrl = (rawUrl: string): TypedURL => {
  try {
    const url = new URL(rawUrl);

    if (isTwitter(url)) {
      return {
        type: 'twitter' as const,
        url,
      };
    } else if (isGist(url)) {
      return {
        type: 'gist' as const,
        url,
      };
    } else if (isCodePen(url)) {
      return {
        type: 'codepen' as const,
        url,
      };
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const Embed: React.VFC<BlockObject> = (props) => {
  if (props.type !== 'embed') {
    return null;
  }

  const { embed } = props;
  const url = typedUrl(embed.url);

  if (url === null) {
    return null;
  }

  switch (url.type) {
    case 'twitter':
      return <Twitter {...url} />;
    case 'gist':
      return <Gist {...url} />;
    case 'codepen':
      return <CodePen {...url} />;
    default:
      return null;
  }
};

const Twitter = ({ url }: TypedURL) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Box display="flex" justifyContent="center" w="full">
      <blockquote className="twitter-tweet">
        <a href={url.href} />
      </blockquote>
    </Box>
  );
};

const Gist = ({ url }: TypedURL) => {
  const { gistId } = useMemo(() => {
    const [, userId, gistId] = url.pathname.split('/');
    return {
      userId,
      gistId,
    };
  }, [url]);
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/gist-embed@1.0.4/dist/gist-embed.min.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [url]);

  return (
    <code
      data-gist-id={gistId}
      style={{
        width: '100%',
      }}
    />
  );
};

const CodePen = ({ url }: TypedURL) => {
  const { userId, codeId } = useMemo(() => {
    const [, userId, , codeId] = url.pathname.split('/');
    return {
      userId,
      codeId,
    };
  }, [url]);

  return (
    <iframe
      height="800"
      style={{ width: '100%' }}
      scrolling="no"
      title="Recursion"
      src={`https://codepen.io/${userId}/embed/${codeId}`}
      frameBorder="no"
      loading="lazy"
    >
      See the Pen <a href={url.href}>Recursion</a> by
      <a href={`https://codepen.io/${userId}`}>{`@${userId}`}</a> on{' '}
      <a href="https://codepen.io">CodePen</a>.
    </iframe>
  );
};
