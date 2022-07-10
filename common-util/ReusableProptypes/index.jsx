import PropTypes from 'prop-types';

export const ProviderProptype = PropTypes.shape({
  disconnect: PropTypes.func,
  on: PropTypes.func,
  removeListener: PropTypes.func,
});
