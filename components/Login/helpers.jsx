import WalletConnectProvider from '@walletconnect/web3-provider';

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID, // required
      rpc: {
        5: process.env.NEXT_PUBLIC_GOERLI_URL,
        31337: process.env.NEXT_PUBLIC_AUTONOLAS_URL,
      },
    },
  },
};
