import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Discord from 'common-util/SVGs/discord';
import Login from '../Login';
import {
  CustomLayout, HeaderContainer, Container, SubFooter,
} from './styles';

const { Header, Content } = Layout;

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

const NavigationBar = ({ children }) => {
  const router = useRouter();

  return (
    <CustomLayout pathname={router.pathname}>
      <Header>
        <HeaderContainer>
          <div className="column-1" />

          <Login />
        </HeaderContainer>
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">{children}</div>
      </Content>

      <Container>
        <SubFooter>
          <div className="socials">
            {getLink({
              href: 'https://discord.com/invite/z2PT65jKqQ',
              children: <Discord />,
            })}
          </div>
        </SubFooter>
      </Container>
    </CustomLayout>
  );
};

NavigationBar.propTypes = {
  children: PropTypes.element,
};

NavigationBar.defaultProps = {
  children: null,
};

export default NavigationBar;
