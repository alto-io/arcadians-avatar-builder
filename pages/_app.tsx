import '../styles/globals.css';
import '../styles/_fonts.css';
import Script from 'next/script';

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Script src="lib/jsora.min.js"></Script>
    <Script src="lib/lodash.min.js"></Script>
    <Component {...pageProps} />
    </>
  );
}
