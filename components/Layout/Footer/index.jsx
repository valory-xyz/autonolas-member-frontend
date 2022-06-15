import React from 'react';
import Twitter from 'common-util/SVGs/twitter';
import Discord from 'common-util/SVGs/discord';
import { Container, SubFooter } from './styles';

/* eslint-disable-next-line react/prop-types */
const getLink = ({ href, children, className = '' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
  >
    {children}
  </a>
);

const Footer = () => (
  <Container>
    <SubFooter>
      <div className="socials">
        {getLink({
          href: 'https://twitter.com/autonolas',
          children: 'SUPPORTED BY AUTONOLAS',
          className: 'autonolas-twitter',
        })}

        {getLink({
          href: 'https://twitter.com/autonolas',
          children: <Twitter />,
        })}

        {getLink({
          href: 'https://discord.com/invite/z2PT65jKqQ',
          children: <Discord />,
        })}
      </div>
    </SubFooter>
  </Container>
);

export default Footer;
