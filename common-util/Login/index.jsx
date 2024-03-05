/* eslint-disable react/prop-types */

'use client';

import React, { useEffect } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig, projectId } from './config';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

// Create modal

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function ContextProvider({ children, initialState }) {
  // useEffect(() => {
  //   createWeb3Modal({
  //     wagmiConfig,
  //     projectId,
  //     enableAnalytics: true, // Optional - defaults to your Cloud configuration
  //   });
  // }, []);

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
