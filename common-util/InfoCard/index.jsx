import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from 'antd/lib';

export const InfoCardContainer = styled.div`
  h5 {
    min-height: 31.5px;
  }
`;

export const ValueText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 58px;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
`;

const { Title, Paragraph } = Typography;

export const InfoCard = ({ title, value, subText }) => (
  <InfoCardContainer>
    <Title level={5}>{title || ' '}</Title>
    <ValueText>{value || ' '}</ValueText>
    <Paragraph>{subText || ' '}</Paragraph>
  </InfoCardContainer>
);

InfoCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  subText: PropTypes.string,
};

InfoCard.defaultProps = {
  title: null,
  value: null,
  subText: null,
};
