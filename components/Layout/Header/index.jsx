import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { URL } from 'util/constants';
// import { TOKEN_ID, URL } from 'util/constants';
import Login from '../../Login';
import { HeaderContainer } from './styles';

const linkToHome = (child, aClassName = '') => (
  <Link href="/">
    <a href="/" className={aClassName}>
      {child}
    </a>
  </Link>
);

export const HeaderSection = () => {
  const router = useRouter();
  const isRoot = router.pathname === URL.ROOT;

  return (
    <HeaderContainer className={isRoot ? '' : 'not-root-page'}>
      <div className="column-1">
        {linkToHome(
          <img
            src="/images/0Header/el-collectooorr-logo.png"
            alt="El collectooorr"
            loading="lazy"
            height={48}
          />,
        )}
      </div>

      <Login />
    </HeaderContainer>
  );
};

export default HeaderSection;
