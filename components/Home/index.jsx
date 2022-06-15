import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'antd/lib';
import { BasketContainer } from './styles';

const Basket = ({ account, balance }) => {
  useEffect(() => {
    window.console.log(account, balance);
  });

  return (
    <>
      <BasketContainer>
        <Row>
          <Col lg={24} md={24}>
            Mohan
          </Col>
        </Row>
      </BasketContainer>
    </>
  );
};

Basket.propTypes = {
  account: PropTypes.string,
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Basket.defaultProps = {
  account: null,
  balance: null,
};

const mapStateToProps = (state) => {
  const { account, balance } = state.setup;
  return { account, balance };
};

export default connect(mapStateToProps, {})(Basket);
