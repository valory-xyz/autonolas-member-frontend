import { useState } from 'react';
import { Tabs } from 'antd/lib';
import { TAB_KEYS } from 'common-util/constants';
import Sale from './Sale';
import VeOlas from './VeOlas';
import { CreateLock } from './VeOlas/WriteFunctionality';
import BuOlas from './BuOlas';
import { CreateLockContainer } from './styles';

const { TabPane } = Tabs;

const Home = () => {
  const [activeKey, setActiveKey] = useState(TAB_KEYS.createLock);

  return (
    <>
      <Tabs
        activeKey={activeKey}
        onChange={(e) => setActiveKey(e)}
      >
        <TabPane tab="Sale" key={TAB_KEYS.sale}>
          <Sale />
        </TabPane>

        <TabPane tab="Create lock" key={TAB_KEYS.createLock}>
          <CreateLockContainer>
            <CreateLock />
          </CreateLockContainer>
        </TabPane>

        <TabPane tab="Manage your lock" key={TAB_KEYS.manageLock}>
          <VeOlas setActiveTab={setActiveKey} />
        </TabPane>

        <TabPane tab="buOLAS" key={TAB_KEYS.buOlas}>
          <BuOlas />
        </TabPane>
      </Tabs>
    </>
  );
};

export default Home;
