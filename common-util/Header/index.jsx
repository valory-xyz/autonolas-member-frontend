import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MEDIA_QUERY } from 'util/theme';

const H2 = styled.h2`
  margin: 0;
  font-size: 62px;
  line-height: normal;
  font-family: "spacegrotesk__bold";
  ${MEDIA_QUERY.laptop} {
    font-size: 50px;
  }

  ${MEDIA_QUERY.tablet} {
    font-size: 42px;
  }
  ${MEDIA_QUERY.mobileL} {
    font-size: 38px;
  }
`;

const Header = ({ title, ...rest }) => <H2 {...rest}>{title}</H2>;

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
