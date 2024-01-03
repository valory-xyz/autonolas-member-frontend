import { VEOLAS } from 'common-util/AbiAndAddresses';
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

export const useCreateLock = () => {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({

    address: VEOLAS.addresses[1],
    abi: VEOLAS.abi,
    functionName: 'createLock',
    args: [],
  });

  const {

    data,
    error: contractError,
    isError: isContractError,
    write,
  } = useContractWrite(config);

  console.log({
    config, contractError, isContractError, write, data,
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const isError = isPrepareError || isContractError;
  const error = (prepareError || contractError)?.message;

  return {
    isLoading,
    isSuccess,
    error,
    isError,
    write,
  };
};
