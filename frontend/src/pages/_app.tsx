import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ThemeProvider } from '@/components/ThemeProvider';
import { config } from '../wagmi';
import Navbar from '@/components/Navbar';
const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
    <script src="https://cdn.jsdelivr.net/npm/browserfs"></script>
    <script src="https://cdn.jsdelivr.net/npm/webtorrent/webtorrent.min.js"></script>
    </Head>
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar/>
          <Component {...pageProps} />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </>
  );
}

export default MyApp;
