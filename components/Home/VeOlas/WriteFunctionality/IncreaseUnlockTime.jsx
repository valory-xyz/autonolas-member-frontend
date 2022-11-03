import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
import { notifyError, notifySuccess } from 'common-util/functions';
import { parseToSeconds, FormItemDate } from '../../common';
import { increaseUnlockTime } from '../utils';

const { Title } = Typography;

const IncreaseUnlockTimeComponent = ({ account, chainId }) => {
  const [form] = Form.useForm();

  const onFinish = async (e) => {
    try {
      const txHash = await increaseUnlockTime({
        time: parseToSeconds(e.unlockTime),
        account,
        chainId,
      });
      notifySuccess(
        'Unlock time increased successfully!',
        `Transaction Hash: ${txHash}`,
      );
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Increase Unlock Time</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="increase-amount-form"
        onFinish={onFinish}
      >
        <FormItemDate />
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!account}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

IncreaseUnlockTimeComponent.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

IncreaseUnlockTimeComponent.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export const IncreaseUnlockTime = connect(
  mapStateToProps,
  null,
)(IncreaseUnlockTimeComponent);
