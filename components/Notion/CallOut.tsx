import { Alert, Box, HStack, Image } from '@chakra-ui/react';
import { BlockObject } from '../../lib/notion/types';
import { RichText } from './RichText';
import twemoji from 'twemoji';

export const CallOut: React.VFC<BlockObject> = (props) => {
  if (props.type !== 'callout') {
    return null;
  }

  const codePoint = twemoji.convert.toCodePoint(
    props.callout.icon.type === 'emoji' ? props.callout.icon.emoji : ''
  );

  return (
    <Alert colorScheme="gray">
      <HStack spacing="1">
        <Box>
          {props.callout.icon.type === 'emoji' ? (
            <Image
              src={`https://twemoji.maxcdn.com/v/latest/svg/${
                codePoint.split('-')[0]
              }.svg`}
              width="1em"
            />
          ) : null}
        </Box>
        <RichText richText={props.callout.text} />
      </HStack>
    </Alert>
  );
};
