import { Typography } from 'antd/lib';
// import { BuolasCreateLock } from './components/CreateLock';
import { BuolasManage } from './components/BuolasManage';

const { Title, Paragraph, Text } = Typography;

export const BuOlas = () => (
  <div>
    <Title>buOLAS</Title>
    <Paragraph style={{ maxWidth: 550 }}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis,
      corrupti?&nbsp;
      <a href="www.google.com" target="_blank">
        <Text type="secondary" underline>
          Learn more
        </Text>
      </a>
    </Paragraph>

    {/* BuOlas create won't be visible to the user & used interally */}
    {/* <BuolasCreateLock /> */}
    <BuolasManage />
  </div>
);
