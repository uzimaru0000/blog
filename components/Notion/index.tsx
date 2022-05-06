import type { BlockObject } from '../../lib/notion/types';
import { Heading, Image, List, ListItem, Text } from '@chakra-ui/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { Table } from './Table';
import { Toggle } from './Toggle';
import { Quote } from './Quote';
import { CallOut } from './CallOut';
import { RichText } from './RichText';

export const Notion: React.FC<BlockObject> = (block) => {
  switch (block.type) {
    case 'heading_1': {
      return (
        <Heading as="h1" size="2xl" isTruncated>
          <RichText richText={block.heading_1.text} />
        </Heading>
      );
    }
    case 'heading_2': {
      return (
        <Heading as="h2" size="xl" isTruncated>
          <RichText richText={block.heading_2.text} />
        </Heading>
      );
    }
    case 'heading_3': {
      return (
        <Heading as="h3" size="lg">
          <RichText richText={block.heading_3.text} />
        </Heading>
      );
    }
    case 'paragraph': {
      return <RichText richText={block.paragraph.text} />;
    }
    case 'image': {
      return (
        <>
          <Image
            src={
              block.image.type === 'external'
                ? block.image.external.url
                : block.image.file.url
            }
            alt={block.image.caption.map((x) => x.plain_text).join(' ')}
          />
          <Heading as="h6" size="xs">
            <RichText richText={block.image.caption} />
          </Heading>
        </>
      );
    }
    case 'bulleted_list': {
      return (
        <List listStyleType="disc" paddingLeft="1.5em">
          {block.bulleted_list.map((x) => (
            <Notion key={x.id} {...x} />
          ))}
        </List>
      );
    }
    case 'bulleted_list_item': {
      return (
        <ListItem>
          <RichText richText={block.bulleted_list_item.text} />
        </ListItem>
      );
    }
    case 'numbered_list': {
      return (
        <List as="ol" listStyleType="decimal" paddingLeft="1.5em">
          {block.numbered_list.map((x) => (
            <Notion key={x.id} {...x} />
          ))}
        </List>
      );
    }
    case 'numbered_list_item': {
      return (
        <ListItem>
          <RichText richText={block.numbered_list_item.text} />
        </ListItem>
      );
    }
    case 'code': {
      return (
        <>
          <SyntaxHighlighter language={block.code.language} style={monokai}>
            {block.code.text.map((x) => x.plain_text)}
          </SyntaxHighlighter>
          {block.code.caption.length !== 0 && (
            <Heading as="h6" size="xs">
              <RichText richText={block.code.caption} />
            </Heading>
          )}
        </>
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
    default: {
      return <>not implements</>;
    }
  }
};

const NotionToggle = Toggle(Notion);
