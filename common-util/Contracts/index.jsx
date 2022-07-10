import {
  SALE_CONTRACT_ADDRESS,
  SALE_CONTRACT_ABI,
} from 'common-util/AbiAndAddresses';
import { ethers, providers } from 'ethers';

export const getSaleContract = (e) => {
  // const provider = new ethers.providers.Web3Provider(e);
  // const provider = new providers.Web3Provider(e);
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  console.log({ e, signer: e.getSigner() });
  const contract = new ethers.Contract(
    SALE_CONTRACT_ADDRESS,
    SALE_CONTRACT_ABI,
    e.getSigner(),
  );

  console.log('=>>>>>>>>>>>>>>>');
  console.log(contract);
  return contract;
};
