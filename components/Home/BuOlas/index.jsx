import { Typography } from 'antd/lib';
// import { BuolasCreateLock } from './components/AddToLock';
import { BuolasManage } from './components/BuolasManage';

const { Title, Paragraph, Text } = Typography;

export const BuOlas = () => (
  <div>
    <Title>buOLAS</Title>
    <Paragraph style={{ maxWidth: 550 }}>
      buOLAS is a token vesting contract that allows to lock and linearly
      released OLAS tokens. Usually, this is used for the project team members
      and consultants.&nbsp;
      <a
        href="https://github.com/valory-xyz/autonolas-governance/blob/main/docs/Specs%20of%20governance%20contracts_v1.1.0.pdf"
        target="_blank"
        rel="noreferrer"
      >
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
