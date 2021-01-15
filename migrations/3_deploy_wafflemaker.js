const tdr = require('truffle-deploy-registry');
const WaffleMaker = artifacts.require("WaffleMaker");
const YFLink = artifacts.require("YFLink");
const WrappedOne = artifacts.require("WrappedOne");
const waffleToppings = require('lists/waffle-toppings');
const waffleBases = require('lists/waffle-bases');
const wafflePlates = require('lists/waffle-plates');
const waffleExtras = require('lists/waffle-extras');

module.exports = function (deployer) {
  deployer.then(async () => {
    if (deployer.network === 'development') {
      const yflInstance = await YFLink.deployed();
      const woneInstance = await WrappedOne.deployed();
      return deployer.deploy(WaffleMaker, yflInstance.address, woneInstance.address, waffleToppings, waffleBases, wafflePlates, waffleExtras).then((waffleMakerInstance) => {
        return tdr.appendInstance(waffleMakerInstance);
      });
    } else if (deployer.network === 'testnet') {
      const yflInstance = await YFLink.deployed();
      return deployer.deploy(WaffleMaker, yflInstance.address, process.env.TESTNET_WONE_ADDRESS, waffleToppings, waffleBases, wafflePlates, waffleExtras).then((waffleMakerInstance) => {
        return tdr.appendInstance(waffleMakerInstance);
      });
    } else if (deployer.network === 'mainnet') {
      return deployer.deploy(WaffleMaker, process.env.MAINNET_YFL_ADDRESS, process.env.MAINNET_WONE_ADDRESS, waffleToppings, waffleBases, wafflePlates, waffleExtras).then((waffleMakerInstance) => {
        return tdr.appendInstance(waffleMakerInstance);
      });
    }
  });
};
