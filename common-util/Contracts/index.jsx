import Web3 from 'web3';
import {
  SALE_CONTRACT_ADDRESS,
  SALE_CONTRACT_ABI,
  SALE_CONTRACT_ADDRESS_GOERLI,
  SALE_CONTRACT_ABI_GOERLI,
} from 'common-util/AbiAndAddresses';

export const getSaleContract = (provider, chainId) => {
  const web3 = new Web3(provider);

  // Goerli has separate contract
  const contract = new web3.eth.Contract(
    chainId === 5 ? SALE_CONTRACT_ABI_GOERLI : SALE_CONTRACT_ABI,
    chainId === 5 ? SALE_CONTRACT_ADDRESS_GOERLI : SALE_CONTRACT_ADDRESS,
  );
  return contract;
};
