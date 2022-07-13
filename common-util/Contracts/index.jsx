import { ethers } from 'ethers';
import {
  SALE_CONTRACT_ADDRESS,
  SALE_CONTRACT_ABI,
} from 'common-util/AbiAndAddresses';

export const getSaleContract = (provider) => {
  const contract = new ethers.Contract(
    SALE_CONTRACT_ADDRESS,
    SALE_CONTRACT_ABI,
    provider.getSigner(),
  );

  return contract;
};
