import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { OGTag } from '../components/Head';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="ja">
        <Head />
        <OGTag />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
