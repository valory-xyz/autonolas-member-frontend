import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Layout, Menu, Flex } from 'antd';
import PropTypes from 'prop-types';
import { ExportOutlined } from '@ant-design/icons';
import Footer from './Footer';
import { CustomLayout, Logo } from './styles';

const LogoSvg = dynamic(() => import('common-util/SVGs/logo'));
const Login = dynamic(() => import('../Login'));

const { Header, Content } = Layout;

const NavigationBar = ({ children }) => {
  const router = useRouter();

  const handleMenuItemClick = ({ key }) => {
    if (key === 'veolas') {
      window.open('https://govern.olas.network/veolas', '_blank');
    } else {
      router.push(`/${key}`);
    }
  };

  return (
    <CustomLayout pathname={router.pathname}>
      <Header>
        <div className="column-1">
          <Logo data-testid="member-logo">
            <LogoSvg />
            <span>Member</span>
          </Logo>
        </div>

        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={['buolas']}
          items={[
            {
              key: 'buolas',
              label: 'buOLAS',
              onClick: handleMenuItemClick,
            },
            {
              key: 'veolas',
              label: (
                <Flex gap={8}>
                  veOLAS
                  <ExportOutlined style={{ fontSize: 14 }} />
                </Flex>
              ),
              onClick: handleMenuItemClick,
            },
          ]}
        />
        <Login />
      </Header>

      <Content className="site-layout">
        <div className="site-layout-background">{children}</div>
      </Content>

      <Footer />
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
