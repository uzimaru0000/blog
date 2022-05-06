import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Link,
  HStack,
} from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { EntryLink } from '../../components/EntryLink';
import { Head } from '../../components/Head';
import { Twemoji } from '../../components/Twemoji';
import { getPages } from '../../lib/notion';
import { PageObject } from '../../lib/notion/types';
import NextLink from 'next/link';

type Props = {
  pages: PageObject[];
  tag: string;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const tag = Array.isArray(params.tag) ? params.tag[0] : params.tag;
  const pages = await getPages({
    sorts: [
      {
        property: 'Created',
        direction: 'descending',
      },
    ],
    filter: {
      and: [
        {
          property: 'Publish',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Tags',
          multi_select: {
            contains: tag,
          },
        },
      ],
    },
  });

  return {
    props: {
      pages,
      tag,
    },
    revalidate: 60,
  };
};

const Tags: NextPage<Props> = ({ pages, tag }) => {
  return (
    <Box paddingY="8">
      <Head>
        <title>{`${tag} - uzimaru's blog`}</title>
        <meta name="description" content={`${tag} がついた記事の一覧`} />
      </Head>
      <Container maxWidth={['0em', '30em', '30em', '62em', '62em', '96em']}>
        <NextLink href="/">
          <Link>
            <HStack>
              <Twemoji emoji="⬅" h="1em" />
              <Text>Topに戻る</Text>
            </HStack>
          </Link>
        </NextLink>
        <VStack alignItems="start" spacing="8">
          <Heading
            as="h1"
            fontSize="5xl"
            display="inline-flex"
            alignItems="center"
          >
            <Twemoji emoji="🔖" w="1em" />
            <Text marginLeft="2">{tag}</Text>
          </Heading>
          <VStack alignItems="start" w="full">
            {pages.map((x) => (
              <EntryLink key={x.id} page={x} />
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Tags;
