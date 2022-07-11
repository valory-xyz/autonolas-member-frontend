import Web3 from 'web3';
import {
  SALE_CONTRACT_ADDRESS,
  SALE_CONTRACT_ABI,
} from 'common-util/AbiAndAddresses';

export const getSaleContract = (provider) => {
  const web3 = new Web3(provider);
  const contract = new web3.eth.Contract(
    SALE_CONTRACT_ABI,
    SALE_CONTRACT_ADDRESS,
  );
  return contract;
};
