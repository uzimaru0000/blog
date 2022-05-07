import NextLink from 'next/link';
import {
  Box,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { PageObject } from '../lib/notion/types';
import { useProperty, toBGColor } from '../lib/notion';
import { RichText } from './Notion/RichText';
import dayjs from 'dayjs';
import { Twemoji } from './Twemoji';

export type Props = {
  page: PageObject;
};
export const EntryLink: React.VFC<Props> = ({ page }) => {
  const title = useProperty(page.properties, 'Name', 'title');
  const tags = useProperty(page.properties, 'Tags', 'multi_select');
  const created = useProperty(page.properties, 'Created', 'created_time');
  const updated = useProperty(page.properties, 'Updated', 'last_edited_time');

  return (
    <LinkBox
      w="full"
      borderLeftColor="green.300"
      borderLeftWidth={['4px', '4px', '4px', '0']}
      borderRadius="4px"
      _hover={{
        backgroundColor: 'gray.100',
      }}
    >
      <Stack
        direction={['column', 'column', 'column', 'row']}
        p="4"
        w="full"
        justifyContent="space-between"
        cursor="pointer"
      >
        <NextLink href={`/${page.id}`} passHref>
          <LinkOverlay href={`/${page.id}`}>
            {title && (
              <Text fontSize="lg">{title.title.map((x) => x.plain_text)}</Text>
            )}
          </LinkOverlay>
        </NextLink>
        <Stack direction={['column', 'column', 'column', 'row']}>
          {tags && (
            <HStack>
              {tags.multi_select.map((x) => (
                <NextLink key={x.id} href={`/tags/${x.name}`} passHref>
                  <Link px="4" bg={toBGColor(x.color)} rounded="full">
                    {x.name}
                  </Link>
                </NextLink>
              ))}
            </HStack>
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
                  {dayjs(updated.last_edited_time).format('YYYY/MM/DD hh:mm')}
                </Box>
              </HStack>
            )}
          </HStack>
        </Stack>
      </Stack>
    </LinkBox>
  );
};
