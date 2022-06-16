import Web3 from 'web3';
import { CONRACT_ADDRESS, CONRACT_ABI } from 'common-util/AbiAndAddresses';

export const getSaleContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(CONRACT_ABI, CONRACT_ADDRESS);
  return contract;
};
