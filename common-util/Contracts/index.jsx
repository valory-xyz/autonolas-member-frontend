import Web3 from 'web3';
import {
  // buolas
  BUOLAS_ABI,
  BUOLAS_ADDRESS,

  // veolas
  VEOLAS_ABI,
  VEOLAS_ADDRESS,

  // olas
  OLAS_ABI,
  OLAS_ADDRESS,

  // sale
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
} from 'common-util/AbiAndAddresses';

export const getBuOlaContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(BUOLAS_ABI, BUOLAS_ADDRESS);
  return contract;
};

export const getVeOlaContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(VEOLAS_ABI, VEOLAS_ADDRESS);
  return contract;
};

export const getOlaContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(OLAS_ABI, OLAS_ADDRESS);
  return contract;
};

export const getSaleContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  return contract;
};
