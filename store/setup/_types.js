const reducerName = 'Setup';

export const apiTypes = {
  GET_API: `${reducerName}/Get API`,
};

export const syncTypes = {
  SET_ACCOUNT: `${reducerName}/Set account`,
  SET_BALANCE: `${reducerName}/Set balance`,
  SET_CHAIND_ID: `${reducerName}/Set chain id`,
  SET_LOGIN_ERROR: `${reducerName}/Set error`,
  SET_WALLET_PROVIDER: `${reducerName}/Set wallet provider`,
  SET_ETHERS_PROVIDER: `${reducerName}/Set ethers provider`,
  SET_STORE_STATE: `${reducerName}/Set Store State`,
};
