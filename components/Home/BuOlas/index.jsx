import { Typography } from 'antd/lib';
// import { BuolasCreateLock } from './components/AddToLock';
import { BuolasManage } from './components/BuolasManage';

const { Title, Paragraph } = Typography;

export const BuOlas = () => (
  <div>
    <Title>buOLAS</Title>
    <Paragraph style={{ maxWidth: 550 }}>
      buOLAS is a token that is used for the project team members and
      consultants.&nbsp;
    </Paragraph>

    {/* BuOlas create won't be visible to the user & used interally */}
    {/* <BuolasCreateLock /> */}
    <BuolasManage />
  </div>
);
