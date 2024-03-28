/* eslint-disable jest/require-hook */
import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi';

import { createWeb3Modal } from '@web3modal/wagmi/react'; /* eslint-disable-line import/no-unresolved */
import { COLOR } from '@autonolas/frontend-library';

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

export const SUPPORTED_CHAINS = [mainnet, goerli];

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'Autonolas Member',
  description: 'Manage your veOLAS and buOLAS',
  url: 'https://member.autonolas.network/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

/**
 * @type {import('@web3modal/wagmi').WagmiOptions}
 */
export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, goerli], // required
  projectId,
  metadata,
  ssr: false,
  storage: createStorage({ storage: cookieStorage }),
});

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
