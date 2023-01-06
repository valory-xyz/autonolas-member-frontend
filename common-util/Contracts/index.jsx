import Web3 from 'web3';
import {
  SALE_ADDRESS_MAINNET,
  SALE_ABI_MAINNET,
  SALE_ADDRESS_GOERLI,
  SALE_ABI_GOERLI,
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
  VEOLAS_ABI_GOERLI,
  VEOLAS_ADDRESS_MAINNET,
  VEOLAS_ABI_MAINNET,
} from 'common-util/AbiAndAddresses';
import { LOCAL_CHAIN_ID } from 'util/constants';

const LOCAL_ADDRESSES = {
  OLAS_ADDRESS_LOCAL: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  VEOLAS_ADDRESS_LOCAL: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  BUOLAS_ADDRESS_LOCAL: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
};

const getContractAddress = (type, chainId) => {
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

export const getSaleContract = (p, chainId) => {
  const web3 = new Web3(p);

  // Goerli has separate contract
  const contract = new web3.eth.Contract(
    chainId === 5 ? SALE_ABI_GOERLI : SALE_ABI_MAINNET,
    chainId === 5 ? SALE_ADDRESS_GOERLI : SALE_ADDRESS_MAINNET,
  );
  return contract;
};

export const getOlasContract = (p, chainId) => {
  const web3 = new Web3(p);
  const contract = new web3.eth.Contract(
    chainId === 5 ? OLAS_ABI_GOERLI : OLAS_ABI_MAINNET,
    getContractAddress('olas', chainId),
  );
  return contract;
};

export const getVeolasContract = (p, chainId) => {
  const web3 = new Web3(p);
  const contract = new web3.eth.Contract(
    chainId === 5 ? VEOLAS_ABI_GOERLI : VEOLAS_ABI_MAINNET,
    getContractAddress('veOlas', chainId),
  );
  return contract;
};

export const getBuolasContract = (p, chainId) => {
  const web3 = new Web3(p);
  const contract = new web3.eth.Contract(
    chainId === 5 ? BUOLAS_ABI_GOERLI : BUOLAS_ABI_MAINNET,
    getContractAddress('buOlas', chainId),
  );
  return contract;
};
