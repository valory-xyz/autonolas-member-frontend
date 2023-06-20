import { Footer as CommonFooter } from '@autonolas/frontend-library';

const Footer = () => (
  <CommonFooter
    centerContent={(
      <>
        ©&nbsp;Autonolas DAO&nbsp;
        {new Date().getFullYear()}
      </>
    )}
  />
);

export default Footer;
