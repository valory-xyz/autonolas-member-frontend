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
