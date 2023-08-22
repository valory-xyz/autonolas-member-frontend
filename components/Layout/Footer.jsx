import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Footer as CommonFooter,
  getChainId,
  isGoerli,
} from '@autonolas/frontend-library';
import { getContractAddress } from 'common-util/Contracts';
import Socials from './Socials';
import { ContractsInfoContainer } from './styles';

const ContractInfo = () => {
  const chainId = useSelector((state) => state?.setup?.chainId);

  const router = useRouter();

  const [addressChainId, setAddressChainId] = useState(chainId);
  const { pathname } = router;

  // if chainId changes, update the chainId required for address
  useEffect(() => {
    setAddressChainId(chainId);
  }, [chainId]);

  useEffect(() => {
    if (!addressChainId) {
      setAddressChainId(getChainId());
    }
  }, []);

  if (!addressChainId) return <ContractsInfoContainer />;

  const getCurrentPageAddresses = () => {
    const commonAddresses = {
      textThree: 'Governor',
      textFour: 'Timelock',
      addressThree: getContractAddress('governorTwo', addressChainId),
      addressFour: getContractAddress('timelock', addressChainId),
    };

    if (pathname === '/' || (pathname || '').includes('veolas')) {
      return {
        textOne: 'OLAS',
        textTwo: 'veOLAS',
        addressOne: getContractAddress('olas', addressChainId),
        addressTwo: getContractAddress('veOlas', addressChainId),
        ...commonAddresses,
      };
    }

    if ((pathname || '').includes('buolas')) {
      return {
        textOne: 'OLAS',
        textTwo: 'buOLAS',
        addressOne: getContractAddress('olas', addressChainId),
        addressTwo: getContractAddress('buOlas', addressChainId),
        ...commonAddresses,
      };
    }

    return {
      textOne: null,
      textTwo: null,
      textThree: null,
      textFour: null,
      addressOne: null,
      addressTwo: null,
      addressThree: null,
      addressFour: null,
    };
  };

  const getEtherscanLink = (address) => {
    if (isGoerli(addressChainId)) {
      return `https://goerli.etherscan.io/address/${address}`;
    }
    return `https://etherscan.io/address/${address}`;
  };

  const getContractInfo = (text, addressToPoint) => (
    <div className="registry-contract">
      <a
        href={getEtherscanLink(addressToPoint)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    </div>
  );

  const {
    textOne,
    addressOne,
    textTwo,
    addressTwo,
    textThree,
    addressThree,
    textFour,
    addressFour,
  } = getCurrentPageAddresses();

  return (
    <ContractsInfoContainer>
      <img
        alt="Etherscan link"
        width={18}
        height={18}
        src="/images/etherscan-logo.svg"
      />
      <span>Contracts</span>
      &nbsp;•&nbsp;
      {getContractInfo(textOne, addressOne)}
      &nbsp;•&nbsp;
      {getContractInfo(textTwo, addressTwo)}
      &nbsp;•&nbsp;
      {getContractInfo(textThree, addressThree)}
      &nbsp;•&nbsp;
      {getContractInfo(textFour, addressFour)}
    </ContractsInfoContainer>
  );
};

const Footer = () => (
  <CommonFooter
    rightContent={<Socials />}
    leftContent={<ContractInfo />}
    centerContent={(
      <>
        ©&nbsp;Autonolas DAO&nbsp;
        {new Date().getFullYear()}
        &nbsp;•&nbsp;
        <Link href="/disclaimer">Disclaimer</Link>
        &nbsp;•&nbsp;
        <a
          href="https://gateway.autonolas.tech/ipfs/bafybeibrhz6hnxsxcbv7dkzerq4chssotexb276pidzwclbytzj7m4t47u"
          target="_blank"
          rel="noopener noreferrer"
        >
          DAO constitution
        </a>
      </>
    )}
  />
);

export default Footer;
