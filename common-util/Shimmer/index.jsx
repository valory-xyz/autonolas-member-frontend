import { Skeleton } from 'antd';
import PropTypes from 'prop-types';

export const Shimmer = ({ active = true }) => (
  <Skeleton.Input active={active} style={{ maxWidth: 60 }} />
);

Shimmer.propTypes = { active: PropTypes.bool };

Shimmer.defaultProps = { active: true };
