import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Notion } from '../components/Notion';
import { getBlocks, getPages } from '../lib/notion';
import type { BlockObject } from '../lib/notion/types';

type Props = {
  page: BlockObject[];
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await getPages();

  return {
    paths: pages.results.map((x) => `/${x.id}`),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = await getBlocks(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  return {
    props: {
      page,
    },
  };
};

const Page: NextPage<Props> = ({ page }) => {
  return (
    <>
      {page.map((x) => (
        <Notion key={x.id} {...x} />
      ))}
    </>
  );
};

export default Page;
