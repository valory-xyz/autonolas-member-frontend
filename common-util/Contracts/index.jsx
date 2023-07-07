import Web3 from 'web3';
import { getChainId } from '@autonolas/frontend-library';
import {
  // Olas
  OLAS_ABI_GOERLI,
  OLAS_ADDRESS_GOERLI,
  OLAS_ABI_MAINNET,
  OLAS_ADDRESS_MAINNET,

  // buOlas
  BUOLAS_ADDRESS_GOERLI,
  BUOLAS_ABI_GOERLI,
  BUOLAS_ADDRESS_MAINNET,
  BUOLAS_ABI_MAINNET,

  // veOlas
  VEOLAS_ADDRESS_GOERLI,
  VEOLAS_ADDRESS_MAINNET,
  VEOLAS_ABI,

  // wveOlas
  WVEOLAS_ADDRESS_MAINNET,
  WVEOLAS_ABI_MAINNET,
} from 'common-util/AbiAndAddresses';
import { LOCAL_CHAIN_ID } from 'util/constants';

/**
 * Addresses fetched when backend connected locally
 * to hardhat from initDeploy.json
 */
export const LOCAL_ADDRESSES = {
  OLAS_ADDRESS_LOCAL: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  VEOLAS_ADDRESS_LOCAL: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  BUOLAS_ADDRESS_LOCAL: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

/**
 * Returns contract address based on type and chainId.
 * Right now, only 3 types are supported: olas, veOlas, buOlas
 * and 3 chains: local, goerli and mainnet.
 */
export const getContractAddress = (type, chainIdPassed) => {
  const chainId = chainIdPassed || getChainId() || 1; // default to mainnet

  switch (type) {
    case 'veOlas': {
      if (chainId === LOCAL_CHAIN_ID) {
        return LOCAL_ADDRESSES.VEOLAS_ADDRESS_LOCAL;
      }
      if (chainId === 5) return VEOLAS_ADDRESS_GOERLI;
      return VEOLAS_ADDRESS_MAINNET;
    }
    case 'buOlas': {
      if (chainId === LOCAL_CHAIN_ID) {
        return LOCAL_ADDRESSES.BUOLAS_ADDRESS_LOCAL;
      }
      if (chainId === 5) return BUOLAS_ADDRESS_GOERLI;
      return BUOLAS_ADDRESS_MAINNET;
    }
    case 'olas':
    default: {
      if (chainId === LOCAL_CHAIN_ID) return LOCAL_ADDRESSES.OLAS_ADDRESS_LOCAL;
      if (chainId === 5) return OLAS_ADDRESS_GOERLI;
      return OLAS_ADDRESS_MAINNET;
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
  const { web3, chainId } = getWeb3Details();
  const contract = new web3.eth.Contract(
    chainId === 1 ? OLAS_ABI_MAINNET : OLAS_ABI_GOERLI,
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
          abi: WVEOLAS_ABI_MAINNET,
          address: WVEOLAS_ADDRESS_MAINNET,
        };
      }

      return {
        abi: VEOLAS_ABI,
        address: VEOLAS_ADDRESS_MAINNET,
      };
    }

    return {
      abi: VEOLAS_ABI,
      address: VEOLAS_ADDRESS_GOERLI,
    };
  };

  const { address, abi } = getAddressAndAbi();

  const contract = new web3.eth.Contract(abi, address);
  return contract;
};

export const getBuolasContract = () => {
  const { web3, chainId } = getWeb3Details();
  const contract = new web3.eth.Contract(
    chainId === 1 ? BUOLAS_ABI_MAINNET : BUOLAS_ABI_GOERLI,
    getContractAddress('buOlas'),
  );
  return contract;
};

export const rpc = {
  1: process.env.NEXT_PUBLIC_MAINNET_URL,
  5: process.env.NEXT_PUBLIC_GOERLI_URL,
};
