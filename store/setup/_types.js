const reducerName = 'Setup';

export const apiTypes = {
  GET_API: `${reducerName}/Get API`,
};

export const syncTypes = {
  SET_ACCOUNT: `${reducerName}/Set account`,
  SET_BALANCE: `${reducerName}/Set balance`,
  SET_LOGIN_ERROR: `${reducerName}/Set error`,
  SET_WALLET_PROVIDER: `${reducerName}/Set Wallet Provider`,
  SET_ETHERS_PROVIDER: `${reducerName}/Set Ethers Provider`,
  SET_STORE_STATE: `${reducerName}/Set Store State`,
};
