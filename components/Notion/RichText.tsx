import { chakra, As, Box, Text as ChakraText, Link } from '@chakra-ui/react';
import twemoji from 'twemoji';
import { isBGColor, toBGColor, toColor } from '../../lib/notion';
import { RichText as RichTextType } from '../../lib/notion/types';
import NextLink from 'next/link';
import { Twemoji } from '../Twemoji';

export const RichText: React.VFC<{ richText: RichTextType[]; as?: As }> = ({
  richText,
  as,
}) => {
  return (
    <Box as={as}>
      {richText.map((x, i) =>
        x.type === 'text' ? (
          <Text key={`${i}-${x.plain_text}`} {...x} />
        ) : (
          <Mention key={`${i}-${x.plain_text}`} {...x} />
        )
      )}
    </Box>
  );
};

const Text: React.VFC<RichTextType> = ({ annotations, ...props }) => {
  if (props.type !== 'text') {
    return null;
  }

  const { bold, code, strikethrough, color, italic, underline } = annotations;
  const bg = isBGColor(color) ? color.match(/(.+)_background/)[1] : undefined;
  const linkProps = {
    as: 'a' as const,
    href: props.text.link?.url,
    color: 'blue.700',
    textDecoration: 'underline',
  };

  return (
    <ChakraText
      as="span"
      fontWeight={bold && 'bold'}
      color={toColor(color) ? toColor(color) : code ? 'red.600' : undefined}
      bgColor={toBGColor(bg) ? toBGColor(bg) : code ? 'gray.100' : undefined}
      fontStyle={italic && 'italic'}
      textDecoration={[
        strikethrough && 'line-through',
        underline && 'underline',
      ].filter(Boolean)}
      padding={code && '1'}
      rounded={code && '4px'}
      {...(props.text.link ? linkProps : {})}
    >
      {code ? props.text.content : <InlineTwemoji text={props.text.content} />}
    </ChakraText>
  );
};

const Mention: React.VFC<RichTextType> = ({ annotations, ...props }) => {
  if (props.type !== 'mention' || props.mention.type !== 'page') {
    return null;
  }

  const { bold, code, strikethrough, color, italic, underline } = annotations;
  const bg = isBGColor(color) ? color.match(/(.+)_background/)[1] : undefined;

  return (
    <NextLink href={`/${props.mention.page.id}`}>
      <Link
        fontWeight={bold && 'bold'}
        color={toColor(color) ? toColor(color) : code ? 'red.600' : undefined}
        bgColor={toBGColor(bg) ? toBGColor(bg) : code ? 'gray.100' : undefined}
        fontStyle={italic && 'italic'}
        textDecoration={[
          strikethrough && 'line-through',
          underline && 'underline',
        ]
          .filter(Boolean)
          .join(' ')}
        padding={code && '1'}
        rounded={code && '4px'}
        display="inline-flex"
        alignItems="center"
      >
        <Twemoji emoji="📝" width="1em" display="inline" />
        {code ? props.plain_text : <InlineTwemoji text={props.plain_text} />}
      </Link>
    </NextLink>
  );
};

const InlineTwemoji: React.VFC<{ text: string }> = ({ text }) => {
  const parsed = twemoji.parse(text, {
    folder: 'svg',
    ext: '.svg',
  });
  if (text.length === parsed.length) {
    return <>{text}</>;
  }

  return <chakra.span dangerouslySetInnerHTML={{ __html: parsed }} />;
};
