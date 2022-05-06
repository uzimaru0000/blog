import { Box } from '@chakra-ui/react';
import { BlockObject } from '../../lib/notion/types';
import { RichText } from './RichText';

export const Toggle =
  (Renderer: React.VFC<BlockObject>): React.VFC<BlockObject> =>
  (props) => {
    if (props.type !== 'toggle') {
      return null;
    }

    return (
      <details>
        <RichText as="summary" richText={props.toggle.text} />
        <Box paddingLeft="1.5em">
          {props.children?.map((x) => (
            <Renderer {...x} />
          ))}
        </Box>
      </details>
    );
  };
