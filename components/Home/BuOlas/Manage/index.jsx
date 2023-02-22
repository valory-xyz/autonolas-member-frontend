import { useState } from 'react';
import {
  Button, Alert, Row, Col,
} from 'antd/lib';
import { getString } from 'common-util/functions';
import { InfoCard } from 'common-util/InfoCard';
import { getToken } from '../../common';
import { withdrawRequest } from './utils';
import { useFetchBuolasBalances } from '../hooks';
import { MiddleContent, Sections } from '../../styles';
import { BuOlasContainer, WriteFunctionalityContainer } from '../styles';

const getTime = (seconds) => (seconds ? new Date(seconds).toLocaleDateString() : '--');

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
  } = useFetchBuolasBalances;

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

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            value={getTime(mappedBalances?.startTime)}
            subText="Vesting time"
          />
        </Col>

        <Col lg={6} md={24} xs={24}>
          <InfoCard
            value={getTime(mappedBalances?.endTime)}
            subText="Time to vest"
          />
        </Col>

        <Col lg={4} md={24} xs={24}>
          <InfoCard
            value={getString(buolasReleasableAmount)}
            subText="Vested amount"
          />
        </Col>
      </Row>

      <br />
      <Row align="top">
        {/* Next releasable amount and time */}
        <Col lg={4} md={24} xs={24}>
          <InfoCard
            title="Next vesting"
            value={getString(buolasNextReleasableAmount)}
            subText="amount"
          />
        </Col>

        <Col lg={4} md={24} xs={24}>
          <InfoCard value={getTime(buolasNextReleasableTime)} subText="time" />
        </Col>
      </Row>

      <BuOlasContainer>
        <div className="left-content">
          <MiddleContent className="balance-container">
            <Sections>
              {getToken({
                tokenName: 'Balance',
                token: buolasBalance || '--',
              })}
              {getToken({
                tokenName: 'Vesting time',
                token: getTime(mappedBalances?.startTime),
              })}
              {getToken({
                tokenName: 'Time to vest',
                token: getTime(mappedBalances?.endTime),
              })}
              {getToken({
                tokenName: 'Vested amount',
                token: buolasReleasableAmount || '--',
              })}
            </Sections>
          </MiddleContent>

          <MiddleContent className="balance-container">
            <Sections>
              {getToken({
                tokenName: 'Next Vesting amount',
                token: buolasNextReleasableAmount || '--',
              })}
              {getToken({
                tokenName: 'Next Vesting time',
                token: getTime(buolasNextReleasableTime),
              })}
            </Sections>
          </MiddleContent>
        </div>

        {/* show Withdraw button only if releasable amount > 0 */}
        <WriteFunctionalityContainer>
          <Button
            type="primary"
            disabled={isWithdrawLoading || buolasReleasableAmount <= 0}
            onClick={onWithdraw}
            loading={isWithdrawLoading}
          >
            Withdraw
          </Button>
          {buolasReleasableAmount <= 0 && (
            <Alert
              message="You have no releasable amount to withdraw"
              type="warning"
            />
          )}
        </WriteFunctionalityContainer>
      </BuOlasContainer>
    </>
  );
};
