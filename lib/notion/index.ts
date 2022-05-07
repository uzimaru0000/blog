import { Client } from '@notionhq/client';
import { QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import {
  BlockObject,
  MatchType,
  PageObject,
  Property,
  RichText,
} from './types';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DB_ID;

export const getPages = async (
  args: Omit<QueryDatabaseParameters, 'database_id'>
) => {
  try {
    const res = await notion.databases.query({
      database_id: databaseId,
      ...args,
    });
    return res.results as PageObject[];
  } catch (e) {
    console.log(e);
  }
};

export const getPage = async (id: string) => {
  const res = (await notion.pages.retrieve({ page_id: id })) as PageObject;
  return res;
};

export const getBlocks = async (block_id: string): Promise<BlockObject[]> => {
  const res = await notion.blocks.children.list({ block_id });
  const results = res.results as BlockObject[];

  const getChildren = results.map(async (x) => {
    if (x.has_children) {
      x.children = await getBlocks(x.id);
    }

    return x;
  });

  return Promise.all(getChildren).then(reduceList);
};

export const isBGColor = (color: RichText['annotations']['color']) => {
  return /(.+)_background/.test(color);
};

export const toColor = (color: string) => {
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

export const toBGColor = (color: string) => {
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

export const useProperty = <T extends Property['type']>(
  properties: PageObject['properties'],
  key: string,
  type: T
): MatchType<Property, { type: T }> | null => {
  const property = properties[key];

  return property.type === type
    ? (property as MatchType<Property, { type: T }>)
    : null;
};

const reduceList = (blocks: BlockObject[]): BlockObject[] => {
  const { st, stack, isUnorderList } = blocks.reduce(
    (acc, x) => {
      // ulな要素が来ていたら
      if (acc.isUnorderList) {
        if (x.type === 'bulleted_list_item') {
          acc.stack.push(x);
          return acc;
        } else {
          acc.st.push({
            type: 'bulleted_list',
            bulleted_list: [...acc.stack],
            has_children: false,
            id: acc.stack.map((x) => x.id.slice(0, 3)).join('-'),
          });
          acc.stack = [];
          acc.isUnorderList = false;
        }
      }

      // olな要素が来ていたら
      if (acc.isOrderList) {
        if (x.type === 'numbered_list_item') {
          acc.stack.push(x);
          return acc;
        } else {
          acc.st.push({
            type: 'numbered_list',
            numbered_list: [...acc.stack],
            has_children: false,
            id: acc.stack.map((x) => x.id.slice(0, 3)).join('-'),
          });
          acc.stack = [];
          acc.isOrderList = false;
        }
      }

      if (x.type === 'bulleted_list_item') {
        acc.isUnorderList = true;
        acc.stack.push(x);

        return acc;
      }

      if (x.type === 'numbered_list_item') {
        acc.isOrderList = true;
        acc.stack.push(x);

        return acc;
      }

      acc.st.push(x);
      return acc;
    },
    {
      st: [] as BlockObject[],
      stack: [] as BlockObject[],
      isUnorderList: false,
      isOrderList: false,
    }
  );

  const rest: BlockObject[] =
    stack.length !== 0
      ? isUnorderList
        ? [
            {
              type: 'bulleted_list' as const,
              bulleted_list: stack,
              has_children: false,
              id: stack.map((x) => x.id.slice(0, 3)).join('-'),
            },
          ]
        : [
            {
              type: 'numbered_list' as const,
              numbered_list: stack,
              has_children: false,
              id: stack.map((x) => x.id.slice(0, 3)).join('-'),
            },
          ]
      : [];

  return [...st, ...rest];
};
