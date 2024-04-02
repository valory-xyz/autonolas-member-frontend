import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAccount, useBalance } from 'wagmi';
import {
  setUserAccount,
  setUserBalance,
  setChainId,
  setErrorMessage,
  setLogout,
} from 'store/setup/actions';
import { LoginV2 as LoginComponent } from 'common-util/Login';

const Login = () => {
  const { address, chainId } = useAccount();
  const { data } = useBalance({ address, chainId });
  const dispatch = useDispatch();

  useEffect(() => {
    if (address) {
      dispatch(setUserAccount(address));
      dispatch(setUserBalance(data?.formatted));
      dispatch(setChainId(chainId));
    } else {
      dispatch(setLogout());
    }
  }, [address, chainId, data?.formatted, dispatch]);

  const onConnect = (response) => {
    dispatch(setUserAccount(response.address));
    dispatch(setUserBalance(response.balance));
    dispatch(setChainId(response.chainId));
  };

  const onDisconnect = useCallback(() => {
    dispatch(setLogout());
  }, [dispatch]);

  const onError = useCallback(
    (error) => {
      dispatch(setErrorMessage(error));
    },
    [dispatch],
  );

  return (
    <div>
      <LoginComponent
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        onError={onError}
      />
    </div>
  );
};

export default Login;
