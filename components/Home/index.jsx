import { useState } from 'react';
import { Tabs } from 'antd/lib';
import { TAB_KEYS } from 'common-util/constants';
import VeOlas from './VeOlas/ManageYourLock';
import { CreateLock } from './VeOlas/CreateLock';
import BuOlas from './BuOlas';

const { TabPane } = Tabs;

const Home = () => {
  // const [activeKey, setActiveKey] = useState(TAB_KEYS.createLock);
  const [activeKey, setActiveKey] = useState(TAB_KEYS.buOlas);

  return (
    <>
      <Tabs activeKey={activeKey} onChange={(e) => setActiveKey(e)}>
        <TabPane tab="Create lock" key={TAB_KEYS.createLock}>
          <CreateLock />
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
