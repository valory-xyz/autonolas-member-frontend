import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ethers, providers } from 'ethers';
import { CustomButton as Button } from 'common-util/Button';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      // infuraId: 'a5184169a2dd4263b4c164a088353eec', // required
      rpc: {
        31337: 'https://chain.staging.autonolas.tech/',
        // 1: 'https://mainnet.infura.io/v3/a5184169a2dd4263b4c164a088353eec',
      },
    },
  },
};
const TestModal = () => {
  const [web3Modal, setWeb3Modal] = useState(null);
  const [address, setAddress] = useState('');

  async function addListeners(web3ModalProvider) {
    web3ModalProvider.on('accountsChanged', (accounts) => {
      window.location.reload();
      console.log({ accounts });
    });

    // Subscribe to chainId change
    web3ModalProvider.on('chainChanged', (chainId) => {
      window.location.reload();
      console.log({ chainId });
    });
  }

  const connectWallet = async () => {
    const provider = await web3Modal.connect();

    addListeners(provider);

    const ethersProvider = new providers.Web3Provider(provider);
    const userAddress = await ethersProvider.getSigner().getAddress();
    setAddress(userAddress);
  };

  console.log(address);

  useEffect(() => {
    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: 'mainnet',
      providerOptions,
      // theme: {
      //   background: 'rgb(39, 49, 56)',
      //   main: 'rgb(199, 199, 199)',
      //   secondary: 'rgb(136, 136, 136)',
      //   border: 'rgba(195, 195, 195, 0.14)',
      //   hover: 'rgb(16, 26, 32)',
      // },
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  useEffect(() => {
    // connect automatically and without a popup if user is already connected
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [web3Modal]);

  return (
    <Container>
      {address ? (
        <div>
          <h3>{address}</h3>
        </div>
      ) : (
        <Button variant="purple" onClick={connectWallet}>
          Connect
        </Button>
      )}
    </Container>
  );
};

export default TestModal;
