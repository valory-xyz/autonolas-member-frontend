import { syncTypes } from './_types';

export const setUserAccount = (account) => ({
  type: syncTypes.SET_ACCOUNT,
  data: { account },
});

export const setUserBalance = (balance) => ({
  type: syncTypes.SET_BALANCE,
  data: { balance },
});

export const setErrorMessage = (errorMessage) => ({
  type: syncTypes.SET_LOGIN_ERROR,
  data: { errorMessage },
});

export const setProvider = (provider) => ({
  type: syncTypes.SET_WALLET_PROVIDER,
  data: { provider },
});

export const setEthersProvider = (web3Provider) => ({
  type: syncTypes.SET_ETHERS_PROVIDER,
  data: { web3Provider },
});
