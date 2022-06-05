import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  Link,
  HStack,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { EntryLink } from '../../components/EntryLink';
import { Head, OGTag } from '../../components/Head';
import { Twemoji } from '../../components/Twemoji';
import { getPages } from '../../lib/notion';
import { PageObject } from '../../lib/notion/types';
import NextLink from 'next/link';
import { Footer } from '../../components/Footer';

type Props = {
  pages: PageObject[];
  tag: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
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
  };
};

const Tags: NextPage<Props> = ({ pages, tag }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      pt="8"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Head>
        <title>{`${tag} - uzimaru's blog`}</title>
        <meta name="description" content={`${tag} がついた記事の一覧`} />
      </Head>
      <OGTag />
      <Container
        pb="8"
        maxWidth={['30em', '30em', '30em', '62em', '62em', '96em']}
      >
        <HStack w="full" justify="space-between">
          <NextLink href="/">
            <Link>
              <HStack>
                <Twemoji emoji="⬅" h="1em" />
                <Text>Topに戻る</Text>
              </HStack>
            </Link>
          </NextLink>
          <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            icon={
              colorMode === 'light' ? (
                <Twemoji emoji="🌙" w="1em" />
              ) : (
                <Twemoji emoji="☀" w="1em" />
              )
            }
          />
        </HStack>
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
      <Footer />
    </Box>
  );
};

export default Tags;
