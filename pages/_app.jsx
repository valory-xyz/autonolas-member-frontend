import Head from 'next/head';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

// web3modal and wagmi provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { wagmiConfig } from 'common-util/Login/config';

import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import { THEME_CONFIG } from '@autonolas/frontend-library';
import { useRouter } from 'next/router';
import { wrapper } from '../store';

const queryClient = new QueryClient();

const MyApp = ({ Component, ...rest }) => {
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

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};

  return { pageProps };
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

export default wrapper.withRedux(MyApp);
