const tdr = require('truffle-deploy-registry');
const WaffleMaker = artifacts.require("WaffleMaker");

module.exports = function (deployer, network) {
  deployer.then(async () => {
    if (network === 'mainnet') {
      return deployer.deploy(WaffleMaker, process.env.MAINNET_CURRENCY_ADDRESS, process.env.MAINNET_GRAND_PRIZE_PUBLIC_KEY, process.env.MAINNET_DEV_PUBLIC_KEY).then((waffleMakerInstance) => {
        return tdr.appendInstance(waffleMakerInstance);
      });
    } else if (network === 'testnet' || network === 'testnet-fork' || network === 'development') {
      return deployer.deploy(WaffleMaker, process.env.TESTNET_CURRENCY_ADDRESS, process.env.TESTNET_GRAND_PRIZE_PUBLIC_KEY, process.env.TESTNET_DEV_PUBLIC_KEY).then((waffleMakerInstance) => {
        return tdr.appendInstance(waffleMakerInstance);
      });
    }
  });
};
