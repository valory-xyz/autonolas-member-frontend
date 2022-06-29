import WalletConnectProvider from '@walletconnect/web3-provider';

export const provider = new WalletConnectProvider({
  rpc: {
    // 31337: 'https://chain.staging.autonolas.tech/',
    // 1: 'https://mainnet.infura.io/v3/a5184169a2dd4263b4c164a088353eec',
    5: 'https://eth-goerli.alchemyapi.io/v2/_SrakDJgKhVl19B6EUYK9LEiyU1auKsL',
  },
  pollingInterval: 8000,
  chainId: 5,
});

export default provider;
