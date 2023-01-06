import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Typography } from 'antd/lib';
import { notifyError, notifySuccess } from 'common-util/functions';
import { parseAmount, FormItemInputNumber } from '../../common';
import { updateIncreaseAmount } from '../utils';

const { Title } = Typography;

const IncreaseAmountComponent = ({ account, chainId }) => {
  const [form] = Form.useForm();

  const onFinish = async (e) => {
    try {
      const txHash = await updateIncreaseAmount({
        amount: parseAmount(e.amount),
        account,
        chainId,
      });
      notifySuccess(
        'Amount increased successfully!',
        `Transaction Hash: ${txHash}`,
      );
    } catch (error) {
      window.console.error(error);
      notifyError('Some error occured');
    }
  };

  return (
    <>
      <Title level={3}>Increase Amount</Title>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="increase-amount-form"
        onFinish={onFinish}
      >
        <FormItemInputNumber />
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!account}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

IncreaseAmountComponent.propTypes = {
  account: PropTypes.string,
  chainId: PropTypes.number,
};

IncreaseAmountComponent.defaultProps = {
  account: null,
  chainId: null,
};

const mapStateToProps = (state) => {
  const { account, chainId } = state.setup;
  return { account, chainId };
};

export const IncreaseAmount = connect(
  mapStateToProps,
  null,
)(IncreaseAmountComponent);
