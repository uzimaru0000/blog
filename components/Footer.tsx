import { Center, HStack, Link, Text } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <HStack
      as="footer"
      bg="gray.100"
      w="full"
      h="10rem"
      justifyContent="center"
    >
      <Center>
        <Text whiteSpace="break-spaces">© 2022 </Text>
        <Link href="https://twitter.com/uzimaru0000">uzimaru</Link>
      </Center>
    </HStack>
  );
};
