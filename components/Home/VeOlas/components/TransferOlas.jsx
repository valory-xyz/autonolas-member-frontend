import React from 'react';
import { Button } from 'antd/lib';
import { notifySuccess, notifyError } from 'common-util/functions';
import { useFetchBalances } from '../hooks';
import { transferOlasToAccountRequest } from '../contractUtils';

export const TransferOlas = () => {
  const { account, chainId, getData } = useFetchBalances();

  const transferHelper = async (signer) => {
    try {
      await transferOlasToAccountRequest({
        account,
        chainId,
        signer,
      });

      notifySuccess('OLAS transferred successfully');

      // fetch the newly updated mapped balances & votes.
      getData();
    } catch (error) {
      notifyError('Some error occured while transfering OLAS');
    }
  };

  const onClick = async () => {
    // account name: mint test in metamask
    // await transferHelper('0xb795AD9CcC91e99B7Ea52aDB71C2dA2b17eB0235');

    // account name: mint again in metamask
    // await transferHelper('0x888465C3A8Eb71B998A814Bb70BED64D2F3c50F9');

    // account from local backend
    await transferHelper('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');
  };

  return (
    <div>
      <Button type="danger" onClick={onClick}>
        Transfer OLAS
      </Button>
    </div>
  );
};
