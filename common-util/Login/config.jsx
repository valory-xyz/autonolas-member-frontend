/* eslint-disable react/prop-types */

import { useEffect } from 'react';
import { COLOR } from '@autonolas/frontend-library';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { WagmiConfig } from 'wagmi';
import { mainnet } from 'viem/chains';

import { RPC_URLS } from 'common-util/Contracts';

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

const mainnetChain = {
  ...mainnet,
  explorerUrl: RPC_URLS[1],
};

// set chains
const chains = [mainnetChain];

// metadata
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/'],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

export function Web3Modal({ children }) {
  useEffect(() => {
    createWeb3Modal({
      wagmiConfig,
      chains,
      projectId,
      themeMode: 'light',
      themeVariables: {
        '--w3m-button-border-radius': '5px',
        '--w3m-accent-color': COLOR.PRIMARY,
        '--w3m-background-color': COLOR.PRIMARY,
      },
    });
  }, []);

  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
