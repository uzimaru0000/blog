import { Alert, Box, HStack, Image } from '@chakra-ui/react';
import { BlockObject, Color } from '../../lib/notion/types';
import { RichText } from './RichText';
import { Twemoji } from '../Twemoji';
import { isBGColor, toBGColor, toColor } from '../../lib/notion';

export const CallOut: React.VFC<BlockObject> = (props) => {
  if (props.type !== 'callout') {
    return null;
  }
  const color = (props.callout as unknown as { color: Color }).color;
  const bg = isBGColor(color) ? color.match(/(.+)_background/)[1] : undefined;

  return (
    <Alert
      bgColor={bg ? toBGColor(bg) : 'transparent'}
      color={!bg && toColor(color)}
      borderWidth="1px"
      borderColor={!bg && 'gray.500'}
      rounded="4px"
    >
      <HStack spacing="1">
        <Box>
          {props.callout.icon.type === 'emoji' ? (
            <Twemoji emoji={props.callout.icon.emoji} width="1em" />
          ) : null}
        </Box>
        <RichText richText={props.callout.text} />
      </HStack>
    </Alert>
  );
};
