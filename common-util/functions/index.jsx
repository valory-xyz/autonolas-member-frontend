import { ethers } from 'ethers';
import dayjs from 'dayjs';
import { isNil, toLower } from 'lodash';

import { NA } from 'common-util/constants';

import {
  isValidAddress,
  getChainIdOrDefaultToMainnet as getChainIdOrDefaultToMainnetFn,
  getIsValidChainId as getIsValidChainIdFn,
  sendTransaction as sendTransactionFn,
} from '@autonolas/frontend-library';

import { RPC_URLS } from 'common-util/Contracts';
import { SUPPORTED_CHAINS } from 'common-util/Login';
import { SUPPORTED_CHAINS_MORE_INFO } from 'common-util/Login/config';
import prohibitedAddresses from '../../data/prohibited-addresses.json';

export const getModalProvider = () => window?.MODAL_PROVIDER;

export const getWindowEthereum = () => window?.ethereum;

export const getChainId = (chainId = null) => {
  if (chainId) return chainId;

  // chainId fetched from sessionStorage
  const chainIdfromSessionStorage = typeof sessionStorage === 'undefined'
    ? 1
    : Number(sessionStorage.getItem('chainId'));

  // if chainId is not supported, throw error
  if (
    !SUPPORTED_CHAINS_MORE_INFO.find((e) => e.id === chainIdfromSessionStorage)
  ) {
    return new Error('Invalid chain id');
  }

  return chainIdfromSessionStorage || 1;
};

export const getProvider = () => {
  const defaultChainId = getChainId();
  const rpcUrl = RPC_URLS[defaultChainId];

  if (!rpcUrl) {
    throw new Error(`No RPC URL found for chainId: ${defaultChainId}`);
  }

  if (typeof window === 'undefined') {
    console.warn(
      'No provider found, fetching RPC URL from first supported chain',
    );
    return rpcUrl;
  }

  // connected via wallet-connect
  const walletProvider = getModalProvider();
  if (walletProvider) {
    const walletConnectChainId = Number(walletProvider.chainId);

    // if logged in via wallet-connect but chainId is not supported,
    // default to mainnet (ie. Use JSON-RPC provider)
    return walletConnectChainId === defaultChainId ? walletProvider : rpcUrl;
  }

  // NOT logged in but has wallet installed (eg. Metamask).
  // If chainId is not supported, default to mainnet (ie. Use JSON-RPC provider)
  const windowEthereum = getWindowEthereum();
  if (windowEthereum?.chainId) {
    const walletChainId = Number(windowEthereum.chainId);

    return walletChainId === defaultChainId ? windowEthereum : rpcUrl;
  }

  // fallback to mainnet JSON RPC provider
  return rpcUrl;
};

export const getEthersProvider = () => {
  const provider = getProvider();

  // if provider is a string, it is a JSON-RPC provider
  if (typeof provider === 'string') {
    return new ethers.providers.JsonRpcProvider(provider);
  }

  return new ethers.providers.Web3Provider(provider, 'any');
};

export const getIsValidChainId = (chainId) => getIsValidChainIdFn(SUPPORTED_CHAINS, chainId);

export const getChainIdOrDefaultToMainnet = (chainId) => {
  const x = getChainIdOrDefaultToMainnetFn(SUPPORTED_CHAINS, chainId);
  return x;
};

export const sendTransaction = (fn, account) => sendTransactionFn(fn, account, {
  supportedChains: SUPPORTED_CHAINS,
  rpcUrls: RPC_URLS,
});

export const addressValidator = () => ({
  validator(_, value) {
    return isValidAddress(value)
      ? Promise.resolve()
      : Promise.reject(new Error('Please enter valid addresses.'));
  },
});

// check if the provider is gnosis safe
export const checkIfGnosisSafe = async (account, provider) => {
  const code = await provider.getCode(account);
  return code !== '0x';
};

/**
 * https://docs.ethers.org/v5/api/utils/constants/#constants-MaxUint256
 */
export const MAX_AMOUNT = ethers.MaxUint256;

/**
 *
 * @param {BigNumebr} value value to be converted to Eth
 * @param {Number} dv Default value to be returned
 * @returns {String} with 2 decimal places
 */
export const formatToEth = (value, dv = 0) => {
  if (isNil(value)) return dv || 0;
  return (+ethers.formatEther(value)).toFixed(2);
};

/**
 * Same as `formatToEth` but doesn't fixes the decimal to 8
 * @returns {String} eg: 1000000000000000000 => 1
 */
export const parseToEth = (amount) => (amount ? ethers.formatEther(`${amount}`) : 0);

/**
 * multiplies the amount by 10^18
 */
export const parseToWei = (amount) => ethers.parseUnits(`${amount}`, 18).toString();

/**
 * parse eth to wei
 * example 1 => 1000000000000000000
 */
export const parseEther = (n) => ethers.parseEther(`${n}`);

export const getBlockTimestamp = async (block = 'latest') => {
  const temp = await window?.WEB3_PROVIDER.eth.getBlock(block);
  return temp.timestamp * 1;
};

/**
 * Converts a number to a compact format
 * @param {Number} x
 * @returns {String} eg: 1000000 => 1M, 12345.67 => 12.35K
 */
export const getFormattedNumber = (x) => {
  if (isNil(x)) return '0';

  // if < 9999 then show 2 decimal places with comma
  // if (x < 9999) return x.toLocaleString('en', { maximumFractionDigits: 2 });

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    minimumFractionDigits: 0,
    // maximumFractionDigits: 5,
  }).format(x);
};

/**
 * Converts a number to a comma separated format
 * @param {Number} x
 * @returns {String} eg: 1000000 => 1,000,000, 12345.67 => 12,345.67
 */
export const getCommaSeparatedNumber = (x) => {
  if (isNil(x) || Number(x) === 0) return '0';

  return new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
  }).format(x);
};

/**
 * converts to percentage and returns a string with 2 decimal places
 */
export const getTotalVotesPercentage = (votes, totalSupply) => {
  if (votes && totalSupply) {
    const votesInEth = Number(parseToEth(votes));
    const totalSupplyInEth = Number(parseToEth(totalSupply));
    const votingPowerInPercentage = (
      (votesInEth / totalSupplyInEth)
      * 100
    ).toFixed(2);

    return getFormattedNumber(votingPowerInPercentage);
  }

  return null;
};

/**
 * Get formatted date from milliseconds
 * example, 1678320000000 => Mar 09 '23
 */
export const getFormattedDate = (ms) => {
  if (!ms) return NA;
  return dayjs(ms).format("MMM DD 'YY");
};

/**
 * Get formatted date from milliseconds including time
 * example, 1678320000000 => Mar 09 '2023 16:00
 */
export const getFullFormattedDate = (ms) => {
  if (!ms) return NA;
  return dayjs(ms).format("MMM DD 'YYYY, HH:mm");
};

export const isAddressProhibited = (address) => {
  const addresses = prohibitedAddresses.map((e) => toLower(e));
  return addresses.includes(toLower(address));
};
