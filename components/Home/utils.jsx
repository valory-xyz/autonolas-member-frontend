import Web3 from 'web3';
import axios from 'axios';
import { ethers } from 'ethers';
import { notification } from 'antd/lib';
import { sortBy, map, toInteger } from 'lodash';
import { METAMASK_ERROR_MSG, SEND_ETH_TO } from 'util/constants';
import { COLOR } from 'util/theme';
import {
  ARTBLOCKS_ADDRESS,
  BASKET_ADDRESS,
} from 'common-util/AbiAndAddresses/artBlocksContract';
import {
  getArtBlocksContract,
  getBasketContract,
  getVaultContract,
} from 'common-util/Contracts';

export const sortByKeys = (object) => {
  const keys = Object.keys(object);
  const sortedKeys = sortBy(keys);
  return map(sortedKeys, (key) => [key, object[key]]);
};

// helper functions for fetching NFT
const getJsonData = (url) => new Promise((resolve, reject) => {
  axios
    .get(url)
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      reject(error);
    });
});

const getOwnerOf = (token, id) => new Promise((resolve, reject) => {
  const contract = getBasketContract(token);

  contract.methods
    .ownerOf(id)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

// -------------- BASKET--------------
const getFilteredNfts = async (basketToken) => {
  const contract = getBasketContract(basketToken);
  const depositedNfts = await contract.getPastEvents('DepositERC721', {
    fromBlock: 0,
    toBlock: 'latest',
  });

  const withdrawnNfts = await contract.getPastEvents('WithdrawERC721', {
    fromBlock: 0,
    toBlock: 'latest',
  });

  const nfts = depositedNfts.filter((depositedNft) => {
    const isWithdrawn = withdrawnNfts.find(
      (nft) => nft.returnValues.tokenId === depositedNft.returnValues.tokenId,
    );

    return !isWithdrawn;
  });

  return nfts;
};

export const getBaskets = async () => {
  const filteredNfts = await getFilteredNfts(BASKET_ADDRESS);

  return new Promise((resolve, reject) => {
    try {
      const promises = [];
      for (let i = 0; i < filteredNfts.length; i += 1) {
        const { token, tokenId } = filteredNfts[i].returnValues;
        const currentContract = getBasketContract(token);
        const result = currentContract.methods.tokenURI(tokenId).call();
        promises.push(result);
      }

      Promise.all(promises).then(async (list) => {
        const results = await Promise.all(
          list.map(async (url, i) => {
            const { token, tokenId } = filteredNfts[i].returnValues;
            const result = await getJsonData(url);
            const txn = await getOwnerOf(token, tokenId);
            return { ...result, txn };
          }),
        );
        resolve(results);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getNftsInfo = async (totalNft) => {
  const web3 = new Web3(window.web3.currentProvider);
  const contract = getBasketContract(ARTBLOCKS_ADDRESS);

  const blockNum = await web3.eth.getBlockNumber();
  const list = await contract.getPastEvents('Mint', {
    fromBlock: blockNum - 10000,
  });

  const getMetadata = () => new Promise((resolve, reject) => {
    const artBlocksContract = getArtBlocksContract();
    try {
      const promises = [];
      for (let i = 0; i < totalNft; i += 1) {
        const { _projectId: pid } = list[i].returnValues;
        const result = artBlocksContract.methods.projectDetails(pid).call();
        promises.push(result);
      }

      Promise.all(promises).then(async (array) => {
        const results = await Promise.all(
          array.map(async (info, i) => {
            const { value } = await web3.eth.getTransaction(
              list[i].transactionHash,
            ); // wei
            const valueInEther = Web3.utils.fromWei(value, 'ether');

            return {
              artist: info.artist,
              bought: valueInEther,
              date: null,
              txn: list[i].transactionHash,
            };
          }),
        );
        resolve(results);
      });
    } catch (error) {
      reject(error);
    }
  });

  const data = await getMetadata();
  return data;
};

// -------------- VAULT --------------
export const getVaultStatus = () => new Promise((resolve, reject) => {
  const contract = getVaultContract();

  contract.methods
    .vaultClosed()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getVaultReservePrice = () => new Promise((resolve, reject) => {
  const contract = getVaultContract();

  contract.methods
    .reservePrice()
    .call()
    .then((response) => {
      const inEth = Web3.utils.fromWei(response, 'ether');
      resolve(inEth);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getVaultSymbol = () => new Promise((resolve, reject) => {
  const contract = getVaultContract();

  contract.methods
    .symbol()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getVaultTotalSupply = () => new Promise((resolve, reject) => {
  const contract = getVaultContract();

  contract.methods
    .totalSupply()
    .call()
    .then((response) => {
      resolve(toInteger(response));
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getBalanceOf = (account) => new Promise((resolve, reject) => {
  const contract = getVaultContract();

  contract.methods
    .balanceOf(account)
    .call()
    .then((response) => {
      resolve(toInteger(response));
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

// -------------- OTHERS --------------
const key = 'addFundsToast';

export const addFunds = async ({ ether }) => {
  try {
    if (!window.ethereum) {
      throw new Error(METAMASK_ERROR_MSG);
    }

    await window.ethereum.send('eth_requestAccounts');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: SEND_ETH_TO,
      value: ethers.utils.parseEther(ether),
    });

    /**
     * toast will be shown if the transaction is in pending state
     */
    notification.warning({
      key,
      message: 'Transaction Pending',
      duration: null,
      style: { border: `1px solid ${COLOR.ANTD_ORANGE}` },
    });

    await tx.wait(); // await till the transaction is completed

    notification.success({
      key,
      message: 'Transaction Success',
      description: (
        <>
          {tx.hash}
          <br />
          <br />
          VLT token will arrive in minutes.
        </>
      ),
      duration: 5,
      style: { border: `1px solid ${COLOR.PRIMARY}` },
    });
  } catch (error) {
    console.error(error);
    notification.error({
      key,
      message: 'Error',
      description: error.message,
      style: { border: `1px solid ${COLOR.RED}` },
    });
  }
};
