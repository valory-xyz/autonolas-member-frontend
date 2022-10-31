import Web3 from 'web3';
import {
  SALE_CONTRACT_ADDRESS,
  SALE_CONTRACT_ABI,
  SALE_CONTRACT_ADDRESS_GOERLI,
  SALE_CONTRACT_ABI_GOERLI,

  // veolas
  VEOLAS_ADDRESS,
  VEOLAS_ABI,
} from 'common-util/AbiAndAddresses';

export const getSaleContract = (p, chainId) => {
  const web3 = new Web3(p);

  // Goerli has separate contract
  const contract = new web3.eth.Contract(
    chainId === 5 ? SALE_CONTRACT_ABI_GOERLI : SALE_CONTRACT_ABI,
    chainId === 5 ? SALE_CONTRACT_ADDRESS_GOERLI : SALE_CONTRACT_ADDRESS,
  );
  return contract;
};

export const getVeolasContract = (p, chainId) => {
  const web3 = new Web3(p);

  // Goerli has separate contract
  const contract = new web3.eth.Contract(
    chainId === 5 ? VEOLAS_ABI : VEOLAS_ABI,
    chainId === 5 ? VEOLAS_ADDRESS : VEOLAS_ADDRESS,
  );
  return contract;
};
