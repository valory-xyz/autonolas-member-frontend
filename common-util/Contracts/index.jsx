import Web3 from 'web3';
import {
  SALE_ADDRESS_MAINNET,
  SALE_ABI_MAINNET,
  SALE_ADDRESS_GOERLI,
  SALE_ABI_GOERLI,

  // buOlas

  // veOlas
  VEOLAS_ADDRESS_GOERLI,
  VEOLAS_ABI_GOERLI,
  VEOLAS_ADDRESS_MAINNET,
  VEOLAS_ABI_MAINNET,
} from 'common-util/AbiAndAddresses';

export const getSaleContract = (p, chainId) => {
  const web3 = new Web3(p);

  // Goerli has separate contract
  const contract = new web3.eth.Contract(
    chainId === 5 ? SALE_ABI_GOERLI : SALE_ABI_MAINNET,
    chainId === 5 ? SALE_ADDRESS_GOERLI : SALE_ADDRESS_MAINNET,
  );
  return contract;
};

export const getVeolasContract = (p, chainId) => {
  const web3 = new Web3(p);

  // Goerli has separate contract
  const contract = new web3.eth.Contract(
    chainId === 5 ? VEOLAS_ABI_GOERLI : VEOLAS_ABI_MAINNET,
    chainId === 5 ? VEOLAS_ADDRESS_GOERLI : VEOLAS_ADDRESS_MAINNET,
  );
  return contract;
};
