import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
import NextLink from 'next/link';
import { Notion } from '../components/Notion';
import { RichText } from '../components/Notion/RichText';
import {
  getBlocks,
  getPage,
  getPages,
  toBGColor,
  useProperty,
} from '../lib/notion';
import type { BlockObject, PageObject } from '../lib/notion/types';
import { Twemoji } from '../components/Twemoji';
import { Footer } from '../components/Footer';
import { Head } from '../components/Head';
import { FaGetPocket, FaTwitter } from 'react-icons/fa';
import { hatena, pocket, twitter } from '../lib/share';

type Props = {
  page: PageObject;
  content: BlockObject[];
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const page = await getPage(
    Array.isArray(params.id) ? params.id[0] : params.id
  );
  const content = await getBlocks(
    Array.isArray(params.id) ? params.id[0] : params.id
  );

  return {
    props: {
      page,
      content,
    },
    revalidate: 60,
  };
};

const Page: NextPage<Props> = ({ page, content }) => {
  const title = useProperty(page.properties, 'Name', 'title');
  const tags = useProperty(page.properties, 'Tags', 'multi_select');
  const created = useProperty(page.properties, 'Created', 'created_time');
  const updated = useProperty(page.properties, 'Updated', 'last_edited_time');
  const cover = page.cover;

  return (
    <Box>
      <Head>
        <title>{`${title.title.map(
          (x) => x.plain_text
        )} - uzimaru's blog`}</title>
      </Head>
      {cover && (
        <Box
          bgImage={
            cover.type === 'external' ? cover.external.url : cover.file.url
          }
          bgPos="center"
          bgSize="cover"
          w="full"
          h="50vh"
          position="sticky"
          top="0"
        />
      )}
      <Flex direction="column">
        <Box zIndex="1" bg="white" w="full" py="8">
          <Container
            maxWidth={['30em', '30em', '30em', '62em', '62em', '96em']}
          >
            <VStack alignItems="start" spacing="8" w="full">
              <VStack alignItems="start" spacing="2">
                {title && (
                  <Box fontSize="5xl">
                    <RichText as="h1" richText={title.title} />
                  </Box>
                )}
                <HStack spacing="4">
                  {created && (
                    <HStack spacing="2">
                      <Twemoji emoji="✏️" w="1em" />
                      <Box>
                        {dayjs(created.created_time).format('YYYY/MM/DD hh:mm')}
                      </Box>
                    </HStack>
                  )}
                  {updated && (
                    <HStack spacing="2">
                      <Twemoji emoji="🔃" w="1em" />
                      <Box>
                        {dayjs(updated.last_edited_time).format(
                          'YYYY/MM/DD hh:mm'
                        )}
                      </Box>
                    </HStack>
                  )}
                </HStack>
                {tags && (
                  <HStack>
                    {tags.multi_select.map((x) => (
                      <NextLink key={x.id} href={`/tags/${x.name}`}>
                        <Link px="4" bg={toBGColor(x.color)} rounded="full">
                          {x.name}
                        </Link>
                      </NextLink>
                    ))}
                  </HStack>
                )}
              </VStack>
              <VStack alignItems="start" w="full">
                {content.map((x) => (
                  <Notion key={x.id} block={x} />
                ))}
              </VStack>
            </VStack>
          </Container>
        </Box>
        <Center pt="8">
          <VStack>
            <HStack spacing="4">
              <Link
                href={twitter(
                  `/${page.id}`,
                  title ? title.title.map((x) => x.plain_text).join('') : ''
                )}
                target="_blank"
                rel="noopener noreferrer"
                bg="twitter.500"
                display="flex"
                p="3"
                rounded="full"
              >
                <Icon as={FaTwitter} w="6" h="6" color="white" />
              </Link>
              <Link
                href={hatena(
                  `/${page.id}`,
                  title ? title.title.map((x) => x.plain_text).join('') : ''
                )}
                target="_blank"
                rel="noopener noreferrer"
                bg="#00A4DE"
                display="flex"
                p="3"
                rounded="full"
                _hover={{
                  textDecoration: 'none',
                }}
              >
                <Box
                  w="6"
                  h="6"
                  whiteSpace="pre"
                  fontWeight="bold"
                  fontSize="24px"
                  lineHeight="24px"
                  color="white"
                >
                  B!
                </Box>
              </Link>
              <Link
                href={pocket(`/${page.id}`)}
                target="_blank"
                rel="noopener noreferrer"
                bg="#ef4056"
                display="flex"
                p="3"
                rounded="full"
              >
                <Icon as={FaGetPocket} w="6" h="6" color="white" />
              </Link>
            </HStack>
            <NextLink href="/">
              <Link>
                <HStack>
                  <Twemoji emoji="⬅" h="1em" />
                  <Text>Topに戻る</Text>
                </HStack>
              </Link>
            </NextLink>
          </VStack>
        </Center>
        <Footer mt="8" />
      </Flex>
    </Box>
  );
};

export default Page;
