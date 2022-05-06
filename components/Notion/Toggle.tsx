import React from 'react';
import { Box } from '@chakra-ui/react';
import { BlockObject } from '../../lib/notion/types';
import { RichText } from './RichText';
import styled from '@emotion/styled';

export const Toggle = (
  Renderer: React.VFC<{ block: BlockObject }>
): React.VFC<BlockObject> =>
  React.memo(function ToggleRenderer(props) {
    if (props.type !== 'toggle') {
      return null;
    }

    return (
      <Details>
        <RichText as="summary" richText={props.toggle.text} />
        <Box paddingLeft="1.5em">
          {props.children?.map((x) => (
            <Renderer key={x.id} block={x} />
          ))}
        </Box>
      </Details>
    );
  });

const Details = styled.details`
  width: 100%;
`;
