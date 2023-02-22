import { useState } from 'react';
import { Tabs } from 'antd/lib';
import { TAB_KEYS } from 'common-util/constants';
import { VeolasAddToLock } from './VeOlas/components/AddToLock';
import { VeolasManage } from './VeOlas/components';
import { BuolasCreateLock } from './BuOlas/CreateLock';
import { BuolasManage } from './BuOlas/Manage';

const { TabPane } = Tabs;

const Home = () => {
  const [activeKey, setActiveKey] = useState(TAB_KEYS.createLock);

  return (
    <>
      <Tabs activeKey={activeKey} onChange={(e) => setActiveKey(e)}>
        <TabPane tab="Create lock" key={TAB_KEYS.createLock}>
          <VeolasAddToLock />
        </TabPane>

        <TabPane tab="Manage your lock" key={TAB_KEYS.manageLock}>
          <VeolasManage setActiveTab={setActiveKey} />
        </TabPane>

        <TabPane tab="Create buOLAS" key={TAB_KEYS.createBuolasLock}>
          <BuolasCreateLock />
        </TabPane>

        <TabPane tab="Manage buOlas" key={TAB_KEYS.manageBuolas}>
          <BuolasManage />
        </TabPane>
      </Tabs>
    </>
  );
};

export default Home;
