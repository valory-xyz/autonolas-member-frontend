'use server';

/* eslint-disable jest/require-hook */
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

// web3modal and wagmi provider
import { wagmiConfig } from 'common-util/Login/config';
import { cookieToInitialState } from 'wagmi';

import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import { THEME_CONFIG } from '@autonolas/frontend-library';
import { useRouter } from 'next/router';
import { ContextProvider } from 'common-util/Login';
import initStore from '../store';

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const isNotLegal = router.pathname === '/not-legal';
  const initialState = cookieToInitialState(wagmiConfig);

  return (
    <>
      <GlobalStyle />
      <Head>
        <title>Autonolas Member</title>
        <meta name="title" content="Manage your veOLAS and buOLAS" />
      </Head>

      <ConfigProvider theme={THEME_CONFIG}>
        {isNotLegal ? (
          <Component {...pageProps} />
        ) : (
          <ContextProvider initialState={initialState}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ContextProvider>
        )}
      </ConfigProvider>
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

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
