import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { config } from '../lib/theme';
import '../styles/globals.css';

const theme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
