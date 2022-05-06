import { Client } from '@notionhq/client';
import { BlockObject } from './types';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DB_ID;

export const getPages = async () => {
  try {
    const res = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
      ],
    });
    return res;
  } catch (e) {
    console.log(e);
  }
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

const reduceList = (blocks: BlockObject[]) => {
  return blocks.reduce(
    (acc, x) => {
      // ulな要素が来ていたら
      if (acc.isUnorderList) {
        if (x.type === 'bulleted_list_item') {
          acc.stack.push(x);
        } else {
          acc.st.push({
            type: 'bulleted_list',
            bulleted_list: [...acc.stack],
            has_children: false,
            id: Date.now().toString(),
          });
          acc.stack = [];
          acc.isUnorderList = false;
        }

        return acc;
      }

      // olな要素が来ていたら
      if (acc.isOrderList) {
        if (x.type === 'numbered_list_item') {
          acc.stack.push(x);
        } else {
          acc.st.push({
            type: 'numbered_list',
            numbered_list: [...acc.stack],
            has_children: false,
            id: Date.now().toString(),
          });
          acc.stack = [];
          acc.isOrderList = false;
        }

        return acc;
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
  ).st;
};
