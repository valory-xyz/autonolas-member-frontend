import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import PropTypes from 'prop-types';
import { Grid } from 'antd';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import styled from 'styled-components';
import { MEDIA_QUERY, notifyError } from '@autonolas/frontend-library';

import { setUserBalance } from 'store/setup/actions';
import { isAddressProhibited } from 'common-util/functions';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: normal;
  ${MEDIA_QUERY.mobileL} {
    margin-top: 0.5rem;
  }
`;

const { useBreakpoint } = Grid;

export const LoginV2 = ({
  onConnect: onConnectCb,
  onDisconnect: onDisconnectCb,
}) => {
  const dispatch = useDispatch();
  const { disconnect } = useDisconnect();

  const { address, connector, chainId } = useAccount({
    onConnect: ({ address: currentAddress }) => {
      if (isAddressProhibited(currentAddress)) {
        disconnect();
      } else if (onConnectCb) {
        onConnectCb({
          address: address || currentAddress,
          balance: null,
          chainId,
        });
      }
    },
    onDisconnect() {
      if (onDisconnectCb) onDisconnectCb();
    },
  });

  // Update the balance
  const { data: balance } = useBalance({ address });
  useEffect(() => {
    if (balance?.formatted) {
      dispatch(setUserBalance(balance.formatted));
    }
  }, [balance?.formatted, dispatch]);

  useEffect(() => {
    const getData = async () => {
      try {
        // This is the initial `provider` that is returned when
        // using web3Modal to connect. Can be MetaMask or WalletConnect.
        const modalProvider = connector?.options?.getProvider?.()
          || (await connector?.getProvider?.());

        if (modalProvider) {
          // We plug the initial `provider` and get back
          // a Web3Provider. This will add on methods and
          // event listeners such as `.on()` will be different.
          const wProvider = new Web3(modalProvider);

          // *******************************************************
          // ************ setting to the window object! ************
          // *******************************************************
          window.MODAL_PROVIDER = modalProvider;
          window.WEB3_PROVIDER = wProvider;

          if (modalProvider?.on) {
            // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
            const handleChainChanged = () => {
              window.location.reload();
            };

            modalProvider.on('chainChanged', handleChainChanged);

            // cleanup
            return () => {
              if (modalProvider.removeListener) {
                modalProvider.removeListener(
                  'chainChanged',
                  handleChainChanged,
                );
              }
            };
          }
        }

        return () => null;
      } catch (error) {
        console.error(error);
        return () => null;
      }
    };

    if (connector && !isAddressProhibited(address)) {
      getData();
    }
  }, [connector, address]);

  // Disconnect if the address is prohibited
  useEffect(() => {
    if (address && isAddressProhibited(address)) {
      disconnect();

      // throw an error
      notifyError(
        <>
          Cannot connect – address is on&nbsp;
          <a
            rel="noreferrer"
            href="https://www.treasury.gov/ofac/downloads/sdnlist.pdf"
            target="_blank"
          >
            OFAC SDN list
          </a>
        </>,
      );

      if (onDisconnectCb) onDisconnectCb();
    }
  }, [address]);

  const screens = useBreakpoint();

  return (
    <LoginContainer>
      {/* <w3m-network-button /> */}
      <w3m-button balance={screens.xs ? 'hide' : 'show'} />
    </LoginContainer>
  );
};

LoginV2.propTypes = {
  onConnect: PropTypes.func,
  onDisconnect: PropTypes.func,
};

LoginV2.defaultProps = {
  onConnect: undefined,
  onDisconnect: undefined,
};
