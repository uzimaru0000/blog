import { Head, OGTag } from '../components/Head';
import { getPages } from '../lib/notion';
import { PageObject } from '../lib/notion/types';
import {
  Box,
  Button,
  Container,
  Heading,
  IconButton,
  Text,
  useColorMode,
  useTheme,
  VStack,
} from '@chakra-ui/react';
import { Twemoji } from '../components/Twemoji';
import { EntryLink } from '../components/EntryLink';
import { GetServerSideProps } from 'next';
import { Footer } from '../components/Footer';

type Props = {
  pages: PageObject[];
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
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
  };
};

export default function Home({ pages }: Props) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      pt="8"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Head />
      <OGTag />
      <Container
        pb="8"
        maxWidth={['30em', '30em', '30em', '62em', '62em', '96em']}
      >
        <VStack alignItems="start" spacing="8">
          <Heading
            as="h1"
            w="full"
            fontSize="5xl"
            display="flex"
            alignItems="center"
          >
            <Twemoji emoji="📖" w="1em" />
            <Text marginLeft="2">{"uzimaru's blog"}</Text>
            <Box flexGrow="1" />
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
          </Heading>
          <VStack alignItems="start" w="full">
            {pages.map((x) => (
              <>
                <EntryLink key={x.id} page={x} />
              </>
            ))}
          </VStack>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}
