/* eslint-disable jest/require-hook */

'use client';

import PropTypes from 'prop-types';
import { createWeb3Modal } from '@web3modal/wagmi/react'; /* eslint-disable-line import/no-unresolved */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { COLOR } from '@autonolas/frontend-library';

import { wagmiConfig, projectId } from './config';

const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

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

export const ContextProvider = ({ children, initialState }) => (
  <WagmiProvider config={wagmiConfig} initialState={initialState}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </WagmiProvider>
);

ContextProvider.propTypes = {
  children: PropTypes.node,
  initialState: PropTypes.shape({}),
};

ContextProvider.defaultProps = {
  children: null,
  initialState: null,
};
