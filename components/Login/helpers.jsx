import WalletConnectProvider from '@walletconnect/web3-provider';

const INFURA_ID = 'a5184169a2dd4263b4c164a088353eec';

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
      rpc: {
        31337: 'https://chain.staging.autonolas.tech/',
        // 1: 'https://mainnet.infura.io/v3/a5184169a2dd4263b4c164a088353eec',
      },
    },
  },
};
