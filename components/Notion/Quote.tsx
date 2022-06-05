import { chakra } from '@chakra-ui/react';
import { BlockObject } from '../../lib/notion/types';
import { RichText } from './RichText';

export const Quote: React.VFC<BlockObject> = (props) => {
  if (props.type !== 'quote') {
    return null;
  }

  return (
    <chakra.blockquote
      pl="4"
      borderLeftWidth="4px"
      borderLeftColor="black"
      color="blackAlpha.700"
      _dark={{
        borderLeftColor: 'white',
        color: 'white',
      }}
    >
      <RichText richText={props.quote.text} />
    </chakra.blockquote>
  );
};
