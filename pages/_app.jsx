/* eslint-disable jest/require-hook */
// import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import PropTypes from 'prop-types';

// import { WagmiConfig as WagmiConfigProvider } from 'wagmi';

// import GlobalStyle from 'components/GlobalStyles';
// import Layout from 'components/Layout';
// import { wagmiConfig } from 'common-util/Login/config';
// import { useRouter } from 'next/router';
import initStore from '../store';

require('../styles/antd.less');

const MyApp = () => 'Site in maintenance mode.';

// const MyApp = ({ Component, pageProps }) => {
//   const router = useRouter();
//   const isNotLegal = router.pathname === '/not-legal';

//   return (
//     <>
//       <GlobalStyle />
//       <Head>
//         <title>Autonolas Member</title>
//         <meta name="title" content="Manage your veOLAS and buOLAS" />
//       </Head>
//       {isNotLegal ? (
//         <Component {...pageProps} />
//       ) : (
//         <WagmiConfigProvider config={wagmiConfig}>
//           <Layout>
//             <Component {...pageProps} />
//           </Layout>
//         </WagmiConfigProvider>
//       )}
//     </>
//   );
// };

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
