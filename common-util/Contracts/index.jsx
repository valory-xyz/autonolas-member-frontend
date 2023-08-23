import Web3 from 'web3';
import { getChainId } from '@autonolas/frontend-library';
import {
  // Olas
  OLAS,

  // buOlas
  BUOLAS,

  // veOlas
  VEOLAS,

  // wveOlas
  WVEOLAS,

  // governor
  GOVERNOR,

  // timelock
  TIMELOCK,
} from 'common-util/AbiAndAddresses';

/**
 * Returns contract address based on type and chainId.
 * Right now, only 3 types are supported: olas, veOlas, buOlas
 * and 3 chains: local, goerli and mainnet.
 */
export const getContractAddress = (type, chainIdPassed) => {
  const chainId = chainIdPassed || getChainId() || 1; // default to mainnet

  switch (type) {
    case 'timelock': {
      if (chainId === 5) return TIMELOCK.addresses[5];
      return TIMELOCK.addresses[1];
    }
    case 'governorTwo': {
      if (chainId === 5) return GOVERNOR.addresses[5];
      return GOVERNOR.addresses[1];
    }
    case 'veOlas': {
      if (chainId === 5) return VEOLAS.addresses[5];
      return VEOLAS.addresses[1];
    }
    case 'wveOlas': {
      if (chainId === 5) return WVEOLAS.addresses[5];
      return WVEOLAS.addresses[1];
    }
    case 'buOlas': {
      if (chainId === 5) return BUOLAS.addresses[5];
      return BUOLAS.addresses[1];
    }
    case 'olas':
    default: {
      if (chainId === 5) return OLAS.addresses[5];
      return OLAS.addresses[1];
    }
  }
};

/**
 * web3 provider =
 * - wallect-connect provider or
 * - currentProvider by metamask or
 * - fallback to remote mainnet [remote node provider](https://web3js.readthedocs.io/en/v1.7.5/web3.html#example-remote-node-provider)
 */
export const getMyProvider = () => window.MODAL_PROVIDER
  || window.web3?.currentProvider
  || process.env.NEXT_PUBLIC_MAINNET_URL;

export const getWeb3Details = () => {
  const web3 = new Web3(getMyProvider());
  const chainId = getChainId() || 1; // default to mainnet
  return { web3, chainId };
};

export const getOlasContract = () => {
  const { web3 } = getWeb3Details();
  const contract = new web3.eth.Contract(
    OLAS.abi,
    getContractAddress('olas'),
  );
  return contract;
};

/**
 *
 */
export const getVeolasContract = (isViewOnly) => {
  const { web3, chainId } = getWeb3Details();

  const getAddressAndAbi = () => {
    if (chainId === 1) {
      // for view methods use wveolas abi and address
      if (isViewOnly) {
        return {
          abi: WVEOLAS.abi,
          address: WVEOLAS.addresses[1],
        };
      }

      return {
        abi: VEOLAS.abi,
        address: VEOLAS.addresses[1],
      };
    }

    return {
      abi: VEOLAS.abi,
      address: VEOLAS.addresses[5],
    };
  };

  const { address, abi } = getAddressAndAbi();

  const contract = new web3.eth.Contract(abi, address);
  return contract;
};

export const getBuolasContract = () => {
  const { web3 } = getWeb3Details();
  const contract = new web3.eth.Contract(
    BUOLAS.abi,
    getContractAddress('buOlas'),
  );
  return contract;
};

export const rpc = {
  1: process.env.NEXT_PUBLIC_MAINNET_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_URL,
};
