import { getOlasContract } from 'common-util/Contracts';
import { formatToEth } from 'common-util/functions';

/**
 * *********************************************
 * functions not used in the UI
 * *********************************************
 */
export const fetchTotalSupplyOfOlas = ({ chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .totalSupply()
    .call()
    .then((response) => {
      window.console.log(response);
    })
    .catch((e) => {
      window.console.log('Error occured on fetching total supply of Olas');
      reject(e);
    });
});

export const mintOlas = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .mint(
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      '10000000000',
      // ethers.BigNumber.from(100000000),
    )
    .send({ from: account })
    .then((response) => {
      window.console.log(response);
    })
    .catch((e) => {
      window.console.log('Error occured on minting Olas:');
      reject(e);
    });
});

export const fetchBalanceOfOlas = ({ account, chainId }) => new Promise((resolve, reject) => {
  const contract = getOlasContract(window.MODAL_PROVIDER, chainId);

  contract.methods
    .balanceOf(account)
    .call()
    .then((response) => {
      resolve(formatToEth(response));
    })
    .catch((e) => {
      window.console.log('Error occured on fetching balance of Olas');
      reject(e);
    });
});
