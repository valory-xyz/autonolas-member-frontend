const reducerName = 'Setup';

export const apiTypes = {
  GET_API: `${reducerName}/Get API`,
};

export const syncTypes = {
  SET_ACCOUNT: `${reducerName}/Set account`,
  SET_BALANCE: `${reducerName}/Set balance`,
  SET_CHAIND_ID: `${reducerName}/Set chain id`,
  SET_LOGIN_ERROR: `${reducerName}/Set error`,

  // veOlas
  SET_MAPPED_BALANCES: `${reducerName}/Set mapped balances`,

  SET_STORE_STATE: `${reducerName}/Set Store State`,
};
