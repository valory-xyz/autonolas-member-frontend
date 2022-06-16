import { Button } from 'antd/lib';
import PropTypes from 'prop-types';
import { COLOR } from 'util/theme';

export const commonStyle = {
  color: COLOR.WHITE,
  borderRadius: '20px',
  fontSize: '14px',
  padding: '6px 32px',
  textTransform: 'uppercase',
  fontFamily: 'spacegrotesk__bold',
};

/**
 * @returns RedButton component
 */

const getStyle = (k) => {
  switch (k) {
    case 'transparent':
      return {
        borderColor: COLOR.WHITE,
        backgroundColor: 'transparent',
      };

    case 'green':
      return {
        borderColor: COLOR.GREEN_2,
        backgroundColor: COLOR.GREEN_2,
        color: COLOR.BLACK,
      };

    case 'disabled':
      return {
        borderColor: COLOR.GREY_1,
        backgroundColor: COLOR.GREY_1,
        color: COLOR.BORDER_GREY,
      };

    default:
      return {};
  }
};

export const CustomButton = ({
  children, variant, style, ...rest
}) => (
  <Button
    {...rest}
    style={{ ...commonStyle, ...getStyle(variant), ...(style || {}) }}
  >
    {children}
  </Button>
);

CustomButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array, PropTypes.string]),
  variant: PropTypes.string,
  style: PropTypes.shape({}),
};

CustomButton.defaultProps = {
  children: null,
  variant: null,
  style: {},
};

export default CustomButton;

//
