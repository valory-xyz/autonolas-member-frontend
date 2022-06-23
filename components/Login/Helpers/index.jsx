import WalletConnectProvider from '@walletconnect/web3-provider';
import { SUPPORTED_NETWORKS } from 'util/constants';

// export function resetWalletConnector(connector) {
//   if (connector && connector instanceof WalletConnectConnector) {
//     // connector.walletConnectProvider = undefined;
//   }
// }

import { InjectedConnector } from '@web3-react/injected-connector';
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const provider = new WalletConnectProvider({
  rpc: {
    31337: 'https://chain.staging.autonolas.tech/',
    // 1: 'https://mainnet.infura.io/v3/a5184169a2dd4263b4c164a088353eec',
  },
  pollingInterval: 8000,
});

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_NETWORKS,
});

// export const resetWalletConnector = (connector) => {
//   if (
//     connector
//     && connector instanceof WalletConnectConnector
//     && connector.walletConnectProvider?.wc?.uri
//   ) {
//     connector.walletConnectProvider = undefined;
//   }
// };
