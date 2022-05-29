import type { BlockObject } from '../../lib/notion/types';
import {
  chakra,
  Heading,
  Image,
  List,
  ListItem,
  VStack,
} from '@chakra-ui/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { Table } from './Table';
import { Toggle } from './Toggle';
import { Quote } from './Quote';
import { CallOut } from './CallOut';
import { RichText } from './RichText';
import { Embed } from './Embed';

export type Props = {
  block: BlockObject;
  opts?: Record<string, string | number | boolean>;
};
export const Notion: React.FC<Props> = ({ block, opts }) => {
  switch (block.type) {
    case 'heading_1': {
      return (
        <Heading as="h1" size="4xl" pt="2.5">
          <RichText richText={block.heading_1.text} />
        </Heading>
      );
    }
    case 'heading_2': {
      return (
        <Heading as="h2" size="xl" pt="2">
          <RichText richText={block.heading_2.text} />
        </Heading>
      );
    }
    case 'heading_3': {
      return (
        <Heading as="h3" size="lg" pt="1.5">
          <RichText richText={block.heading_3.text} />
        </Heading>
      );
    }
    case 'paragraph': {
      return <RichText richText={block.paragraph.text} />;
    }
    case 'image': {
      return (
        <VStack spacing="0" w="full" alignItems="start">
          <Image
            src={
              block.image.type === 'external'
                ? block.image.external.url
                : block.image.file.url
            }
            alt={block.image.caption.map((x) => x.plain_text).join(' ')}
          />
          {block.image.caption.length !== 0 && (
            <Heading as="h6" size="xs">
              <RichText richText={block.image.caption} />
            </Heading>
          )}
        </VStack>
      );
    }
    case 'bulleted_list': {
      const nested = (opts?.nested as number) || 1;
      const listStyle = {
        [0]: 'square',
        [1]: 'disc',
        [2]: 'circle',
      };

      return (
        <List
          listStyleType={[listStyle[nested % 3]]}
          paddingLeft="1.5em"
          w="full"
        >
          {block.bulleted_list.map((x) => (
            <Notion key={x.id} block={x} opts={{ nested }} />
          ))}
        </List>
      );
    }
    case 'bulleted_list_item': {
      const nested = (opts?.nested as number) || 1;

      return (
        <ListItem>
          <RichText richText={block.bulleted_list_item.text} />
          {block.children &&
            block.children.map((x) => (
              <Notion key={x.id} block={x} opts={{ nested: nested + 1 }} />
            ))}
        </ListItem>
      );
    }
    case 'numbered_list': {
      const nested = (opts?.nested as number) || 1;
      const listStyle = {
        [0]: 'lower-roman',
        [1]: 'decimal',
        [2]: 'lower-alpha',
      };

      return (
        <List
          as="ol"
          listStyleType={listStyle[nested % 3]}
          paddingLeft="1.5em"
          w="full"
        >
          {block.numbered_list.map((x) => (
            <Notion key={x.id} block={x} opts={{ nested }} />
          ))}
        </List>
      );
    }
    case 'numbered_list_item': {
      const nested = (opts?.nested as number) || 1;

      return (
        <ListItem>
          <RichText richText={block.numbered_list_item.text} />
          {block.children &&
            block.children.map((x) => (
              <Notion key={x.id} block={x} opts={{ nested: nested + 1 }} />
            ))}
        </ListItem>
      );
    }
    case 'code': {
      return (
        <VStack spacing="0" w="full" alignItems="start">
          <SyntaxHighlighter
            customStyle={{
              width: '100%',
              padding: '2rem',
              borderRadius: '8px',
            }}
            language={block.code.language}
            style={monokai}
          >
            {block.code.text.map((x) => x.plain_text).join('')}
          </SyntaxHighlighter>
          {block.code.caption.length !== 0 && (
            <Heading as="h6" size="xs">
              <RichText richText={block.code.caption} />
            </Heading>
          )}
        </VStack>
      );
    }
    case 'table': {
      return <Table {...block} />;
    }
    case 'toggle': {
      return <NotionToggle {...block} />;
    }
    case 'quote': {
      return <Quote {...block} />;
    }
    case 'callout': {
      return <CallOut {...block} />;
    }
    case 'divider': {
      return (
        <chakra.hr
          w="full"
          style={{ marginTop: '1em', marginBottom: '1em' }}
          my="1em"
        />
      );
    }
    case 'embed': {
      return <Embed {...block} />;
    }
    default: {
      return null;
    }
  }
};

const NotionToggle = Toggle(Notion);
