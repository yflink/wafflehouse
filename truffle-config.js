require('dotenv').config()

const path = require('path')
const { TruffleProvider } = require('@harmony-js/core')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "build/contracts"),
  compilers: {
    solc: {
      version: "^0.6.0"
    }
  },
  networks: {
    // Used only to see if migrations work
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "5777"
    },
    testnet: {
      network_id: '2',
      provider: () => {
        const truffleProvider = new TruffleProvider(
            process.env.TESTNET_URL,
            { },
            { shardID: 0, chainId: 2 },
            { gasLimit: process.env.GAS_LIMIT, gasPrice: process.env.GAS_PRICE },
        );
        const newAcc = truffleProvider.addByPrivateKey(process.env.TESTNET_PRIVATE_KEY);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
    mainnet: {
      network_id: '1',
      provider: () => {
        const truffleProvider = new TruffleProvider(
            process.env.MAINNET_URL,
            { },
            { shardID: 0, chainId: 1 },
            { gasLimit: process.env.GAS_LIMIT, gasPrice: process.env.GAS_PRICE },
        );
        const newAcc = truffleProvider.addByPrivateKey(process.env.MAINNET_PRIVATE_KEY);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    }
  }
};
