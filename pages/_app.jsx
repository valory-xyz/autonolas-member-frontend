import Head from 'next/head';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

// web3modal and wagmi provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  WagmiProvider,
  cookieToInitialState,
  cookieStorage,
  createStorage,
} from 'wagmi';
import { defaultWagmiConfig } from '@web3modal/wagmi';

import { createWeb3Modal } from '@web3modal/wagmi/react'; /* eslint-disable-line import/no-unresolved */

import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import { COLOR, THEME_CONFIG } from '@autonolas/frontend-library';
import { useRouter } from 'next/router';
import { SUPPORTED_CHAINS } from 'common-util/supportedChains';
import { wrapper } from '../store';

const queryClient = new QueryClient();

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const metadata = {
  name: 'Autonolas Member',
  description: 'Manage your veOLAS and buOLAS',
  url: 'https://member.autonolas.network/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

/**
 * @type {import('@web3modal/wagmi').WagmiOptions}
 */
const wagmiConfig = defaultWagmiConfig({
  chains: SUPPORTED_CHAINS,
  projectId,
  metadata,
  ssr: false,
  storage: createStorage({ storage: cookieStorage }),
});

// eslint-disable-next-line jest/require-hook
createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-border-radius-master': '0.7125px',
    '--w3m-font-size-master': '11px',
    '--w3m-accent': COLOR.PRIMARY,
  },
});

const App = ({ Component, ...rest }) => {
  const router = useRouter();
  const isNotLegal = router.pathname === '/not-legal';
  const initialState = cookieToInitialState(wagmiConfig);
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Autonolas Member</title>
        <meta name="title" content="Manage your veOLAS and buOLAS" />
      </Head>

      <Provider store={store}>
        <ConfigProvider theme={THEME_CONFIG}>
          {isNotLegal ? (
            <Component {...props.pageProps} />
          ) : (
            <WagmiProvider config={wagmiConfig} initialState={initialState}>
              <QueryClientProvider client={queryClient}>
                <Layout>
                  <Component {...props.pageProps} />
                </Layout>
              </QueryClientProvider>
            </WagmiProvider>
          )}
        </ConfigProvider>
      </Provider>
    </>
  );
};

App.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

App.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default App;
