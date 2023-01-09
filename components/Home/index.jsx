import { Tabs } from 'antd/lib';
import Sale from './Sale';
import VeOlas from './VeOlas';
import { CreateLock } from './VeOlas/WriteFunctionality';
import BuOlas from './BuOlas';
import TestSection from './VeOlas/TestSection';
import { CreateLockContainer } from './styles';

const { TabPane } = Tabs;

const TAB_KEYS = {
  sale: 'sale',
  createLock: 'createLock',
  manageLock: 'manageLock',
  buOlas: 'buOlas',
  // TODO" remove
  testSection: 'testSection',
};

const Home = () => (
  <>
    <Tabs defaultActiveKey={TAB_KEYS.testSection}>
      <TabPane tab="Sale" key={TAB_KEYS.sale}>
        <Sale />
      </TabPane>

      <TabPane tab="Create lock" key={TAB_KEYS.createLock}>
        <CreateLockContainer>
          <CreateLock />
        </CreateLockContainer>
      </TabPane>

      <TabPane tab="Manage your lock" key={TAB_KEYS.manageLock}>
        <VeOlas />
      </TabPane>

      <TabPane tab="buOLAS" key={TAB_KEYS.buOlas}>
        <BuOlas />
      </TabPane>

      <TabPane tab="Test" key={TAB_KEYS.testSection}>
        <TestSection />
      </TabPane>
    </Tabs>

  </>
);

export default Home;
