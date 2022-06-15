import App from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

import GlobalStyle from 'components/GlobalStyles';
import Layout from 'components/Layout';
import MetamaskProvider from 'components/Login/Helpers/MetamaskProvider';
import initStore from '../store';

require('../styles/antd.less');

const getLibrary = (provider) => new Web3(provider);

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
          <title>El Collectooorr</title>
          <meta name="title" content="El Collectooorr" />
          <meta
            name="description"
            content="Deposit ETH and El Collectooorr intelligently waits for and collects Art Blocks drops on your behalf."
          />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.elcollectooorr.art/" />
          <meta property="og:title" content="El Collectooorr" />
          <meta
            property="og:description"
            content="Deposit ETH and El Collectooorr intelligently waits for and collects Art Blocks drops on your behalf."
          />
          <meta
            property="og:image"
            content="https://www.elcollectooorr.art/images/1CollectAndChill/metadata-background.png"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:url"
            content="https://www.elcollectooorr.art/"
          />
          <meta property="twitter:title" content="El Collectooorr" />
          <meta
            property="twitter:description"
            content="Deposit ETH and El Collectooorr intelligently waits for and collects Art Blocks drops on your behalf."
          />
          <meta
            property="twitter:image"
            content="https://www.elcollectooorr.art/images/1CollectAndChill/metadata-background.png"
          />
          <link href="/fonts/stylesheet.css" rel="stylesheet" />
          <link rel="icon" type="images/png" href="/favicon.ico" />
        </Head>
        <Web3ReactProvider getLibrary={getLibrary}>
          <MetamaskProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MetamaskProvider>
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
