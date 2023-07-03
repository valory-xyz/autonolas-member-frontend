import Link from 'next/link';
import { Footer as CommonFooter } from '@autonolas/frontend-library';
import Socials from './Socials';

const ContractInfo = () => 'ABC';

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
      </>
    )}
  />
);

export default Footer;
