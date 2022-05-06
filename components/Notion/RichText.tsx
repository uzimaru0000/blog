import { As, Box, Text as ChakraText } from '@chakra-ui/react';
import { RichText as RichTextType } from '../../lib/notion/types';

export const RichText: React.VFC<{ richText: RichTextType[]; as?: As }> = ({
  richText,
  as,
}) => {
  return (
    <Box as={as}>
      {richText.map((x) => (
        <Text key={x.href} {...x} />
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
      color={toColor(color)}
      bgColor={toBGColor(bg)}
      fontStyle={italic && 'italic'}
      textDecoration={[
        strikethrough && 'line-through',
        underline && 'underline',
      ].filter(Boolean)}
    >
      {props.text.content}
    </ChakraText>
  );
};

const isBGColor = (color: RichTextType['annotations']['color']) => {
  return /(.+)_background/.test(color);
};

const toColor = (color: string) => {
  const colorSet = {
    red: 'red.500',
    blue: 'blue.500',
    green: 'green.500',
    gray: 'gray.500',
    brown: 'orange.700',
    orange: 'orange.500',
    yellow: 'yellow.500',
    purple: 'purple.500',
    pink: 'pink.500',
  };

  return colorSet[color];
};

const toBGColor = (color: string) => {
  const colorSet = {
    red: 'red.100',
    blue: 'blue.100',
    green: 'green.100',
    gray: 'gray.100',
    brown: '#e4d6d0',
    orange: 'orange.100',
    yellow: 'yellow.100',
    purple: 'purple.100',
    pink: 'pink.100',
  };

  return colorSet[color];
};
