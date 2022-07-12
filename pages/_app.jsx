/* eslint-disable jest/require-hook */
import App from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import initStore from '../store';

require('../styles/antd.less');

const getLibrary = (provider) => new Web3Provider(provider);

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <GlobalStyle />
        <Head>
          <title>Investor App</title>
          <meta name="title" content="Investor App" />
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Web3ReactProvider>
      </>
    );
  }
}

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({})])
    .isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};

const wrapper = createWrapper(initStore);
export default wrapper.withRedux(MyApp);
