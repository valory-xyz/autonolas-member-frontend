import WalletConnectProvider from '@walletconnect/web3-provider';

export const provider = new WalletConnectProvider({
  rpc: {
    // 31337: 'https://staging.chain.autonolas.tech/',
    1: 'https://mainnet.infura.io/v3/a5184169a2dd4263b4c164a088353eec',
  },
  pollingInterval: 8000,
});

export default provider;
