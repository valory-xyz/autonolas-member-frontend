import { useState } from 'react';
import { Tabs } from 'antd/lib';
import { TAB_KEYS } from 'common-util/constants';
import { VeolasCreateLock } from './VeOlas/CreateLock';
import { VeolasManage } from './VeOlas/ManageYourLock';
import { BuolasCreateLock } from './BuOlas/CreateLock';
import { BuolasManage } from './BuOlas/Manage';

const { TabPane } = Tabs;

const Home = () => {
  // const [activeKey, setActiveKey] = useState(TAB_KEYS.createLock);
  const [activeKey, setActiveKey] = useState(TAB_KEYS.createBuOlas);

  return (
    <>
      <Tabs activeKey={activeKey} onChange={(e) => setActiveKey(e)}>
        <TabPane tab="Create lock" key={TAB_KEYS.createLock}>
          <VeolasCreateLock />
        </TabPane>

        <TabPane tab="Manage your lock" key={TAB_KEYS.manageLock}>
          <VeolasManage setActiveTab={setActiveKey} />
        </TabPane>

        <TabPane tab="Create buOLAS" key={TAB_KEYS.createBuOlas}>
          <BuolasCreateLock />
        </TabPane>

        <TabPane tab="Manage buOlas" key={TAB_KEYS.manageBuOlas}>
          <BuolasManage />
        </TabPane>
      </Tabs>
    </>
  );
};

export default Home;
