import { Center, VStack, Link, StackProps, Text } from '@chakra-ui/react';

export const Footer: React.VFC<StackProps> = (props) => {
  return (
    <VStack
      as="footer"
      bg="gray.100"
      w="full"
      h="10rem"
      justifyContent="center"
      {...props}
    >
      <Text color="black">
        このサイトではアクセス解析のためにcookieを使用した
        <Link
          href="https://policies.google.com/technologies/partner-sites"
          color="blue.400"
        >
          Google Analytics
        </Link>
        を使用しています。
      </Text>
      <Center color="black">
        <Text whiteSpace="break-spaces">© 2022 </Text>
        <Link href="https://twitter.com/uzimaru0000">uzimaru</Link>
      </Center>
    </VStack>
  );
};
