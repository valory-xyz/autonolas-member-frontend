import { Divider, Statistic } from 'antd';
import { NA } from '@autonolas/frontend-library';
import PropTypes from 'prop-types';

import { getCommaSeparatedNumber } from 'common-util/functions';

const SECONDS_IN_A_YEAR = 31536000;

const ProjectedVeolas = ({ olasLockInEthUnits, unlockTimeInSeconds }) => {
  /**
   * @returns projected veOLAS amount as per the formula.
   * formula = veOLAS = OLAS * lockDuration / maxLockDuration
   */
  const getProjectedVeolas = () => {
    const maxLockDuration = SECONDS_IN_A_YEAR * 4;
    const todayDateInSeconds = new Date().getTime() / 1000;
    const lockDuration = unlockTimeInSeconds - todayDateInSeconds;

    const projectedVeolas = (olasLockInEthUnits * lockDuration) / maxLockDuration;

    if (!projectedVeolas || lockDuration < 0) {
      return null;
    }
    return projectedVeolas.toFixed(2).toString();
  };

  return (
    <>
      <Divider />
      <Statistic
        title="Projected amount after lock"
        value={`${getCommaSeparatedNumber(getProjectedVeolas()) || NA} veOLAS`}
      />
      <Divider />
    </>
  );
};

ProjectedVeolas.propTypes = {
  olasLockInEthUnits: PropTypes.number,
  unlockTimeInSeconds: PropTypes.number,
};

ProjectedVeolas.defaultProps = {
  olasLockInEthUnits: 0,
  unlockTimeInSeconds: 0,
};

export default ProjectedVeolas;
