import { Skeleton } from 'antd/lib';
import PropTypes from 'prop-types';

export const Shimmer = ({ active = true }) => (
  <Skeleton.Input active={active} block style={{ width: 150 }} />
);

Shimmer.propTypes = { active: PropTypes.bool };

Shimmer.defaultProps = { active: true };
