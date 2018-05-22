import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';
import { injectGlobal } from 'react-emotion';


// Adds server generated styles to emotion cache.
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined') {
  hydrate(window.__NEXT_DATA__.ids)
}

export default class MyDocument extends Document {
  constructor (props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  render () {
    injectGlobal`
      body {
       margin: 0;
      }
    `;
    return (
      <html lang="en-US">
        <Head>
          <meta charSet="utf-8"/>
          <title>Along - Spotify playlist with the Web Speech API</title>
          <meta name="description" content="Universal React app using NextJS, RxJs and the Web Speech API. Listen to your Spotify playlists" />
          <meta name="viewport" content="width=device-width, user-scalable=no" />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css?family=Hind:400,700" rel="stylesheet" />

          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

MyDocument.getInitialProps = ({ renderPage }) => {
  const page = renderPage();
  const styles = extractCritical(page.html);
  return {
    ...page,
    ...styles
   };
}
