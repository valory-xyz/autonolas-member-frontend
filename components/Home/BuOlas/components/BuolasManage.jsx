import { useState } from 'react';
import { Button, Row, Col } from 'antd/lib';
import { getString, getFormattedDate } from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { withdrawRequest } from '../contractUtils';
import { useFetchBuolasBalances } from '../hooks';

export const BuolasManage = () => {
  const {
    account,
    chainId,
    buolasBalance,
    buolasReleasableAmount,
    mappedBalances,
    buolasNextReleasableAmount,
    buolasNextReleasableTime,
    getData,
  } = useFetchBuolasBalances();

  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  const onWithdraw = async () => {
    if (account && chainId) {
      setIsWithdrawLoading(true);
      try {
        await withdrawRequest({ account, chainId });
        getData();
      } catch (error) {
        window.console.error(error);
      } finally {
        setIsWithdrawLoading(false);
      }
    }
  };

  return (
    <>
      <Row align="top">
        <Col lg={4} md={24} xs={24}>
          <InfoCard
            title="Your balance"
            value={getString(buolasBalance)}
            subText="veOLAS"
          />
        </Col>

        <Col lg={4} md={24} xs={24}>
          <InfoCard
            value={getString(buolasReleasableAmount)}
            subText="Vested amount"
          />
          <Button
            disabled={isWithdrawLoading || buolasReleasableAmount <= 0}
            onClick={onWithdraw}
            loading={isWithdrawLoading}
          >
            Claim all
          </Button>
        </Col>

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            value={getFormattedDate(mappedBalances?.startTime)}
            subText="Vesting time"
          />
        </Col>

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            value={getFormattedDate(mappedBalances?.endTime)}
            subText="Time to vest"
          />
        </Col>
      </Row>

      {/* Next releasable amount and time */}
      <Row align="top" style={{ marginTop: '1rem' }}>
        <Col lg={4} md={24} xs={24}>
          <InfoCard
            title="Next vesting"
            value={getString(buolasNextReleasableAmount)}
            subText="amount"
          />
        </Col>

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            value={getFormattedDate(buolasNextReleasableTime)}
            subText="time"
          />
        </Col>
      </Row>
    </>
  );
};
