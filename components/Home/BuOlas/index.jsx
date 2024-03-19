import { Typography } from 'antd';
import { BuolasManage } from './BuolasManage';

const { Title, Paragraph } = Typography;

export const BuOlas = () => (
  <div>
    <Title>buOLAS</Title>
    <Paragraph style={{ maxWidth: 550 }}>
      buOLAS is a locking contract that allows locking and step-wise release of locked OLAS.
      {' '}
      buOLAS is subject to governance risk: locked OLAS can be burned by governance.&nbsp;
    </Paragraph>

    <BuolasManage />
  </div>
);
