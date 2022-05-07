import { Center, HStack, Link, StackProps, Text } from '@chakra-ui/react';

export const Footer: React.VFC<StackProps> = (props) => {
  return (
    <HStack
      as="footer"
      bg="gray.100"
      w="full"
      h="10rem"
      justifyContent="center"
      {...props}
    >
      <Center>
        <Text whiteSpace="break-spaces">© 2022 </Text>
        <Link href="https://twitter.com/uzimaru0000">uzimaru</Link>
      </Center>
    </HStack>
  );
};
