import { formatToEth } from 'common-util/functions';
import {
  getVeolasContract,
} from 'common-util/Contracts';
import { syncTypes } from './_types';

export const setUserAccount = (account) => ({
  type: syncTypes.SET_ACCOUNT,
  data: { account },
});

export const setUserBalance = (balance) => ({
  type: syncTypes.SET_BALANCE,
  data: { balance },
});

export const setChainId = (chainId) => ({
  type: syncTypes.SET_CHAIND_ID,
  data: { chainId },
});

export const setErrorMessage = (errorMessage) => ({
  type: syncTypes.SET_LOGIN_ERROR,
  data: { errorMessage },
});

// veOlas
export const setMappedBalances = (data) => ({
  type: syncTypes.SET_MAPPED_BALANCES,
  data,
});

export const fetchMappedBalances = () => async (dispatch, getState) => {
  const account = getState()?.setup?.account;
  const chainId = getState()?.setup?.chainId;

  try {
    const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);
    const response = await contract.methods
      .mapLockedBalances(account)
      .call();

    dispatch({
      type: syncTypes.SET_MAPPED_BALANCES,
      data: {
        amount: formatToEth(response.amount),
        endTime: response.endTime * 1000, // multiplied by 1000 to convert to milliseconds
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const fetchVotes = () => async (dispatch, getState) => {
  const account = getState()?.setup?.account;
  const chainId = getState()?.setup?.chainId;

  try {
    const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);
    const response = await contract.methods
      .getVotes(account)
      .call();

    dispatch({
      type: syncTypes.SET_VOTES,
      data: { votes: response },
    });
  } catch (error) {
    console.error(error);
  }
};

export const fetchTotalSupplyLocked = () => async (dispatch, getState) => {
  const chainId = getState()?.setup?.chainId;

  try {
    const contract = getVeolasContract(window.MODAL_PROVIDER, chainId);
    const response = await contract.methods
      .totalSupplyLocked()
      .call();

    dispatch({
      type: syncTypes.SET_TOTAL_SUPPLY_LOCKED,
      data: { totalSupplyLocked: response },
    });
  } catch (error) {
    console.error(error);
  }
};
