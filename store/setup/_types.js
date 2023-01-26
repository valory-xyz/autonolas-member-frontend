const reducerName = 'Setup';

export const apiTypes = {
  GET_API: `${reducerName}/Get API`,
};

export const syncTypes = {
  SET_ACCOUNT: `${reducerName}/Set account`,
  SET_BALANCE: `${reducerName}/Set balance`,
  SET_CHAIND_ID: `${reducerName}/Set chain id`,
  SET_LOGIN_ERROR: `${reducerName}/Set error`,

  // OLAS
  SET_OLAS_BALANCE: `${reducerName}/OLAS - balance`,

  // veOlas
  SET_MAPPED_BALANCES: `${reducerName}/Set mapped balances`,
  SET_VOTES: `${reducerName}/Set votes`,
  SET_TOTAL_SUPPLY_LOCKED: `${reducerName}/Set total supply locked`,
  SET_CAN_WITHDRAW_VEOLAS: `${reducerName}/Set Can Withdraw veOlas`,

  SET_STORE_STATE: `${reducerName}/Set Store State`,
};
