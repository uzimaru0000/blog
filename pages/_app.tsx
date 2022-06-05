import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { config } from '../lib/theme';
import usePageView from '../lib/usePageView';
import '../styles/globals.css';

const theme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  usePageView();

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
