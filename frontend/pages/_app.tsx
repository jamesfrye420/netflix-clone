import '../styles/globals.css';
import { GlobalStyles } from '../styles/global-styles';
import 'normalize.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { EmailContextProvider } from '../store/email-context';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Netflix</title>
      </Head>
      <SWRConfig>
        <GlobalStyles />
        <EmailContextProvider>
          <Component {...pageProps} />
        </EmailContextProvider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
