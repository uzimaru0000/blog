import { chakra, As, Box, Text as ChakraText } from '@chakra-ui/react';
import twemoji from 'twemoji';
import { isBGColor, toBGColor, toColor } from '../../lib/notion';
import { RichText as RichTextType } from '../../lib/notion/types';

export const RichText: React.VFC<{ richText: RichTextType[]; as?: As }> = ({
  richText,
  as,
}) => {
  return (
    <Box as={as}>
      {richText.map((x, i) => (
        <Text key={`${i}-${x.plain_text}`} {...x} />
      ))}
    </Box>
  );
};

const Text: React.VFC<RichTextType> = ({ annotations, ...props }) => {
  if (props.type !== 'text') {
    return null;
  }

  const { bold, code, strikethrough, color, italic, underline } = annotations;
  const bg = isBGColor(color) ? color.match(/(.+)_background/)[1] : undefined;

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
    >
      {code ? props.text.content : <InlineTwemoji text={props.text.content} />}
    </ChakraText>
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
