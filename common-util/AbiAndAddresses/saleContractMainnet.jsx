export const SALE_CONTRACT_ADDRESS = '0xD1155408D58293BE0743225bcDe28b9FD0C12378';

export const SALE_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_olasToken', type: 'address' },
      { internalType: 'address', name: '_veToken', type: 'address' },
      { internalType: 'address', name: '_buToken', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'provided', type: 'uint256' },
      { internalType: 'uint256', name: 'expected', type: 'uint256' },
    ],
    name: 'InsufficientAllowance',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint256', name: 'curTime', type: 'uint256' },
    ],
    name: 'LockExpired',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint256', name: 'curTime', type: 'uint256' },
    ],
    name: 'LockNotExpired',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'LockedValueNotZero',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'maxUnlockTime', type: 'uint256' },
      { internalType: 'uint256', name: 'providedUnlockTime', type: 'uint256' },
    ],
    name: 'MaxUnlockTimeReached',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'NoValueLocked',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'NonDelegatable',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'NonTransferable',
    type: 'error',
  },
  { inputs: [], name: 'NonZeroValue', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'provided', type: 'uint256' },
      { internalType: 'uint256', name: 'max', type: 'uint256' },
    ],
    name: 'Overflow',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    name: 'OwnerOnly',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'minUnlockTime', type: 'uint256' },
      { internalType: 'uint256', name: 'providedUnlockTime', type: 'uint256' },
    ],
    name: 'UnlockTimeIncorrect',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'numValues1', type: 'uint256' },
      { internalType: 'uint256', name: 'numValues2', type: 'uint256' },
    ],
    name: 'WrongArrayLength',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'providedBlockNumber', type: 'uint256' },
      { internalType: 'uint256', name: 'actualBlockNumber', type: 'uint256' },
    ],
    name: 'WrongBlockNumber',
    type: 'error',
  },
  { inputs: [], name: 'ZeroAddress', type: 'error' },
  { inputs: [], name: 'ZeroValue', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numSteps',
        type: 'uint256',
      },
    ],
    name: 'ClaimBU',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timePeriod',
        type: 'uint256',
      },
    ],
    name: 'ClaimVE',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numSteps',
        type: 'uint256',
      },
    ],
    name: 'CreateBU',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timePeriod',
        type: 'uint256',
      },
    ],
    name: 'CreateVE',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnerUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'balance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'changeOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'claimableBalances',
    outputs: [
      { internalType: 'uint256', name: 'veBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'buBalance', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'veAccounts', type: 'address[]' },
      { internalType: 'uint256[]', name: 'veAmounts', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'veLockTimes', type: 'uint256[]' },
      { internalType: 'address[]', name: 'buAccounts', type: 'address[]' },
      { internalType: 'uint256[]', name: 'buAmounts', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'buNumSteps', type: 'uint256[]' },
    ],
    name: 'createBalancesFor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'mapBU',
    outputs: [
      { internalType: 'uint128', name: 'amount', type: 'uint128' },
      { internalType: 'uint64', name: 'period', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'mapVE',
    outputs: [
      { internalType: 'uint128', name: 'amount', type: 'uint128' },
      { internalType: 'uint64', name: 'period', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'olasToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'veToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
];
