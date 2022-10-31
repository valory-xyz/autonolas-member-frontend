import { Tabs } from 'antd/lib';
import Sale from './Sale';
import VeOlas from './VeOlas';

const { TabPane } = Tabs;

const TAB_KEYS = {
  sale: 'sale',
  veOlas: 'veOlas',
  buOlas: 'buOlas',
};

const Home = () => (
  <>
    <Tabs defaultActiveKey={TAB_KEYS.veOlas}>
      <TabPane tab="Sale" key={TAB_KEYS.sale}>
        <Sale />
      </TabPane>

      <TabPane tab="veOLAS" key={TAB_KEYS.veOlas}>
        <VeOlas />
      </TabPane>
    </Tabs>
  </>
);

export default Home;
