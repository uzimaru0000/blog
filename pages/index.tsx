import { Head } from '../components/Head';
import { getPages } from '../lib/notion';
import { PageObject } from '../lib/notion/types';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { Twemoji } from '../components/Twemoji';
import { EntryLink } from '../components/EntryLink';
import twemoji from 'twemoji';
import { GetStaticProps } from 'next';

type Props = {
  pages: PageObject[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getPages({
    sorts: [
      {
        property: 'Created',
        direction: 'descending',
      },
    ],
    filter: {
      property: 'Publish',
      checkbox: {
        equals: true,
      },
    },
  });

  return {
    props: {
      pages: data,
    },
    revalidate: 60,
  };
};

export default function Home({ pages }: Props) {
  return (
    <Box paddingY="8">
      <Head />
      <Container maxWidth={['0em', '30em', '30em', '62em', '62em', '96em']}>
        <VStack alignItems="start" spacing="8">
          <Heading
            as="h1"
            fontSize="5xl"
            display="inline-flex"
            alignItems="center"
          >
            <Twemoji emoji="📖" w="1em" />
            <Text marginLeft="2">{"uzimaru's blog"}</Text>
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
}
