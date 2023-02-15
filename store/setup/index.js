import { apiTypes, syncTypes } from './_types';

/**
 * [key]Unformatted: value received from the backend
 */
const initialState = {
  account: null,
  balance: null,
  chainId: null,
  errorMessage: null,

  // olas
  olasBalance: null,

  // veOlas
  canWithdrawVeolas: null,

  // others
  mappedBalances: {
    amount: null,
    endTime: null,
    isMappedAmountZero: true,
  },
  votes: null,
  totalSupplyLocked: null,
  votingPowerInPercentage: null,

  // buOlas
  buolasBalance: null,
  buolasLockedEnd: null,
  buolasReleasableAmount: null,
  buolasMappedBalances: {
    amount: null,
    startTime: null,
    endTime: null,
    transferredAmount: null,
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

    // olas
    case syncTypes.SET_CAN_WITHDRAW_VEOLAS:
    case syncTypes.SET_OLAS_BALANCE: {
      return { ...state, ...data };
    }

    // veOlas
    case syncTypes.SET_MAPPED_BALANCES: {
      const isMappedAmountZero = Number(data.amount) === 0;
      return { ...state, mappedBalances: { ...data, isMappedAmountZero } };
    }
    case syncTypes.SET_VOTES:
    case syncTypes.SET_TOTAL_SUPPLY_LOCKED: {
      return { ...state, ...data };
    }

    // buOlas
    case syncTypes.SET_BUOLAS_BALANCEOF:
    case syncTypes.SET_BUOLAS_RELEASABLE_AMOUNT:
    case syncTypes.SET_BUOLAS_LOCKED_END:
    case syncTypes.SET_BUOLAS_MAPPED_BALANCES: {
      return { ...state, ...data };
    }
    default:
      return state;
  }
};
