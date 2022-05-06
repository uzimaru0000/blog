import { Client } from '@notionhq/client';

type ElementType<T> = T extends (infer U)[] ? U : never;
type MatchType<T, U, V = never> = T extends U ? T : V;

export type PageObject = MatchType<
  Awaited<ReturnType<Client['pages']['retrieve']>>,
  {
    properties: unknown;
  }
>;

export type BlockObject = (
  | MatchType<
      ElementType<
        Awaited<ReturnType<Client['blocks']['children']['list']>>['results']
      >,
      {
        type: unknown;
      }
    >
  | {
      type: 'bulleted_list';
      id: string;
      bulleted_list: BlockObject[];
      has_children: false;
    }
  | {
      type: 'numbered_list';
      id: string;
      numbered_list: BlockObject[];
      has_children: false;
    }
) & { children?: BlockObject[] };

export type BlockType = BlockObject['type'];

export type RichText = ElementType<
  MatchType<BlockObject, { type: 'paragraph' }>['paragraph']['text']
>;

export type Color = RichText['annotations']['color'];

export type Property = PageObject['properties'] extends Record<string, infer T>
  ? T
  : never;
