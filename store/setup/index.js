import { apiTypes, syncTypes } from './_types';

const initialState = {
  account: null,
  balance: null,
  chainId: null,
  errorMessage: null,
  mappedBalances: {
    amount: null,
    endTime: null,
    isMappedAmoutZero: true,
  },
};

export default (state = initialState, action) => {
  const { data } = action;

  switch (action.type) {
    case apiTypes.GET_API: {
      return { ...state, data };
    }

    case syncTypes.SET_ACCOUNT:
    case syncTypes.SET_BALANCE:
    case syncTypes.SET_LOGIN_ERROR:
    case syncTypes.SET_CHAIND_ID:
    case syncTypes.SET_STORE_STATE: {
      return { ...state, ...data };
    }

    // veOlas
    case syncTypes.SET_MAPPED_BALANCES: {
      const isMappedAmoutZero = Number(data.amount) === 0;
      return { ...state, mappedBalances: { ...data, isMappedAmoutZero } };
    }

    default:
      return state;
  }
};
