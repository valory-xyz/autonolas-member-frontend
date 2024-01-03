import { useState } from 'react';
import { Button, Row, Col } from 'antd';
import {
  getFormattedNumber,
  getFormattedDate,
  getCommaSeparatedNumber,
  getFullFormattedDate,
  notifySuccess,
  notifyError,
} from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { withdrawRequest } from '../contractUtils';
import { useFetchBuolasBalances } from '../hooks';

export const BuolasManage = () => {
  const {
    isLoading,
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

  // uncomment this to revoke all vested OLAS (just for testing)
  // useEffect(() => {
  //   if (account && chainId) {
  //     revokeRequest({ account });
  //   }
  // }, [account, chainId]);

  const onWithdraw = async () => {
    if (account && chainId) {
      setIsWithdrawLoading(true);
      try {
        await withdrawRequest({ account });
        notifySuccess('Claimed successfully!');

        // fetch all the data again to update
        getData();
      } catch (error) {
        window.console.error(error);
        notifyError();
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
            isLoading={isLoading}
            title="Your balance"
            value={getFormattedNumber(buolasBalance)}
            tooltipValue={getCommaSeparatedNumber(buolasBalance)}
            subText="buOLAS"
          />
        </Col>

        <Col lg={4} md={24} xs={24}>
          <InfoCard
            isLoading={isLoading}
            value={getFormattedNumber(buolasReleasableAmount)}
            tooltipValue={getCommaSeparatedNumber(buolasReleasableAmount)}
            subText="Vested OLAS"
          />
          <Button
            isLoading={isLoading}
            disabled={isWithdrawLoading || buolasReleasableAmount <= 0}
            onClick={onWithdraw}
            loading={isWithdrawLoading}
          >
            Claim all
          </Button>
        </Col>

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            isLoading={isLoading}
            value={getFormattedDate(mappedBalances?.startTime)}
            tooltipValue={getFullFormattedDate(mappedBalances?.startTime)}
            subText="Vesting start time"
          />
        </Col>

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            isLoading={isLoading}
            value={getFormattedDate(mappedBalances?.endTime)}
            tooltipValue={getFullFormattedDate(mappedBalances?.endTime)}
            subText="Vesting end time"
          />
        </Col>
      </Row>

      {/* Next releasable amount and time */}
      <Row align="top" style={{ marginTop: '1rem' }}>
        <Col lg={4} md={24} xs={24}>
          <InfoCard
            isLoading={isLoading}
            title="Next vesting"
            value={getFormattedNumber(buolasNextReleasableAmount)}
            tooltipValue={getCommaSeparatedNumber(buolasNextReleasableAmount)}
            subText="OLAS"
          />
        </Col>

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            isLoading={isLoading}
            value={getFormattedDate(buolasNextReleasableTime)}
            tooltipValue={getFullFormattedDate(buolasNextReleasableTime)}
            subText="Time"
          />
        </Col>
      </Row>
    </>
  );
};
