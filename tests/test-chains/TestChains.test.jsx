import { BUOLAS } from 'common-util/AbiAndAddresses';
import fs from 'fs';

var assert = require('assert');

const fetch = require('node-fetch');

describe('test-chains/TestChains.jsx', () => {
  it('check contract addresses and ABIs', async () => {
    const localArtifacts = [
      BUOLAS
    ];

    // Registries repository
    const registriesRepo = 'https://raw.githubusercontent.com/valory-xyz/autonolas-governance/main/';
    // Fetch the actual config
    let response = await fetch(registriesRepo + 'docs/configuration.json');
    const parsedConfig = await response.json();

    // Loop over chains
    const numChains = parsedConfig.length;
    for (let i = 0; i < numChains; i++) {
      const contracts = parsedConfig[i]['contracts'];
      // Traverse all tup-to-date configuration contracts
      for (let j = 0; j < contracts.length; j++) {
        // Go over local artifacts
        for (let k = 0; k < localArtifacts.length; k++) {
          // Take the configuration and local contract names that match
          if (contracts[j]['name'] === localArtifacts[k].contractName) {
            // Get local and configuration ABIs, stringify them
            const localABI = JSON.stringify(localArtifacts[k].abi);
            // TODO: update with fetching the URL
            // Get up-to-date remote contract artifact and its ABI
            response = await fetch(registriesRepo + contracts[j]['artifact']);
            const remoteArtifact = await response.json();
            // Stringify the remote ABI and compare with the local one
            const remoteABI = JSON.stringify(remoteArtifact['abi']);
            assert(localABI === remoteABI);

            // Check the address
            const localAddress = localArtifacts[k].addresses[parsedConfig[i]['chainId']];
            assert(localAddress === contracts[j]['address']);
          }
        }
      }
    }
  });
});