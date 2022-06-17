import {
  getOlaContract, getBuOlaContract, getVeOlaContract, getSaleContract, getAgentContract,
} from 'common-util/Contracts';

export const getBuOlasDetails = (address) => new Promise((resolve, reject) => {
  const contract = getBuOlaContract();
  console.log({ contract, account: address });

  contract.methods
    .owner()
    .call()
    .then((response) => {
      console.log({ response });
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getVeOlasDetails = (address) => new Promise((resolve, reject) => {
  const contract = getVeOlaContract();
  console.log({ contract, account: address });

  contract.methods
    .name()
    .call()
    .then((response) => {
      console.log({ response });
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getOlasDetails = (address) => new Promise((resolve, reject) => {
  const contract = getOlaContract();
  console.log({ contract, account: address });

  contract.methods
    .inflationRemainder()
    .call()
    .then((response) => {
      console.log({ response });
      resolve(response);
    })
    .catch((e) => {
      console.error(e);
      reject(e);
    });
});

export const getBalanceDetails = (address) => new Promise((resolve, reject) => {
  const contract = getSaleContract();
  console.log({ contract, account: address });

  contract.methods
    .olasToken()
    .call()
    .then((response) => {
      console.log({ response });
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
