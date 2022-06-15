import Web3 from 'web3';
import {
  BASKET_ADDRESS,
  BASKET_CONTRACT,
  VAULT_ADDRESS,
  VAULT_CONTRACT,
  ARTBLOCKS_ADDRESS,
  ARTBLOCKS_CONTRACT,
} from 'common-util/AbiAndAddresses';

export const getArtBlocksContract = (address = ARTBLOCKS_ADDRESS) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(ARTBLOCKS_CONTRACT.abi, address);
  return contract;
};

export const getBasketContract = (basketAddress = BASKET_ADDRESS) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(BASKET_CONTRACT.abi, basketAddress);
  return contract;
};

export const getVaultContract = () => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = new web3.eth.Contract(VAULT_CONTRACT.abi, VAULT_ADDRESS);
  return contract;
};
