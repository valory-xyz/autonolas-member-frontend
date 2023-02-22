import { Row, Col } from 'antd/lib';
import { useVeolasComponents } from './hooks';

// TODO: show after successful increase amount and increase unlock time
export const NewVotingPower = () => {
  const { getVotingPowerComponent, getVotingPercentComponent } = useVeolasComponents();

  return (
    <Row align="top">
      <Col lg={10} xs={12}>
        {getVotingPowerComponent()}
      </Col>

      <Col lg={14} xs={12}>
        {getVotingPercentComponent()}
      </Col>
    </Row>
  );
};
