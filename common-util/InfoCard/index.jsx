import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography } from 'antd/lib';
import { Shimmer } from '../Shimmer';

const { Title, Paragraph } = Typography;

const InfoCardContainer = styled.div`
  h5 {
    min-height: 31.5px;
  }
`;

const ValueText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 48px;
  line-height: 58px;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
`;

export const InfoCard = ({
  isLoading,
  title,
  value,
  subText,
  hideTitle,
  ...rest
}) => (
  <InfoCardContainer {...rest}>
    {!hideTitle && <Title level={5}>{title || ''}</Title>}
    <ValueText>{isLoading ? <Shimmer /> : <>{value || ''}</>}</ValueText>
    <Paragraph>{subText || ' '}</Paragraph>
  </InfoCardContainer>
);

InfoCard.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  hideTitle: PropTypes.bool,
  value: PropTypes.string,
  subText: PropTypes.string,
};

InfoCard.defaultProps = {
  isLoading: false,
  title: null,
  hideTitle: false,
  value: null,
  subText: null,
};
