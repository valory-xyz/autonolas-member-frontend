import { cookieStorage, createStorage } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { defaultWagmiConfig } from '@web3modal/wagmi';

export const projectId = process.env.NEXT_PUBLIC_WALLET_PROJECT_ID;

export const SUPPORTED_CHAINS = [mainnet, goerli];

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create wagmiConfig
export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, goerli], // required
  projectId, // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
  // ...wagmiOptions, // Optional - Override createConfig parameters
});
