import { Tabs } from 'antd/lib';
import Sale from './Sale';
import VeOlas from './VeOlas';
import { CreateLock } from './VeOlas/WriteFunctionality';
import { CreateLockContainer } from './styles';

const { TabPane } = Tabs;

const TAB_KEYS = {
  sale: 'sale',
  manageLock: 'manageLock',
  createLock: 'createLock',
  buOlas: 'buOlas',
};

const Home = () => (
  <>
    <Tabs defaultActiveKey={TAB_KEYS.createLock}>
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

      {/* <TabPane tab="buOLAS" disabled key={TAB_KEYS.buOlas}> <VeOlas /> </TabPane> */}
    </Tabs>
  </>
);

export default Home;
