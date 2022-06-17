import {
  getOlaContract, getBuOlaContract, getVeOlaContract, getSaleContract, getAgentContract,
} from 'common-util/Contracts';

export const getBuOlasDetails = () => new Promise((resolve, reject) => {
  const contract = getBuOlaContract();

  contract.methods
    .owner()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getVeOlasDetails = () => new Promise((resolve, reject) => {
  const contract = getVeOlaContract();

  contract.methods
    .name()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getOlasDetails = () => new Promise((resolve, reject) => {
  const contract = getOlaContract();

  contract.methods
    .inflationRemainder()
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getBalanceDetails = (address) => new Promise((resolve, reject) => {
  const contract = getSaleContract();

  contract.methods
    .claimableBalances(address)
    .call()
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

// TODO: remove

/**
 * Function to return all agents
 */
export const getAgents = () => new Promise((resolve, reject) => {
  const contract = getAgentContract();

  contract.methods
    .totalSupply()
    .call()
    .then((total) => {
      const allAgentsPromises = [];
      for (let i = 1; i <= total; i += 1) {
        const agentId = `${i}`;
        const result = contract.methods.getInfo(agentId).call();
        allAgentsPromises.push(result);
      }

      Promise.all(allAgentsPromises).then((allAgentsList) => {
        resolve(allAgentsList);
      });
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});
