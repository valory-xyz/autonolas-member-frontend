import PropTypes from 'prop-types';

export const ProviderProptype = PropTypes.shape({
  connected: PropTypes.bool,
  chainId: PropTypes.number,
  disconnect: PropTypes.func,
  on: PropTypes.func,
});
