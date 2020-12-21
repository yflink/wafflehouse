const tdr = require('truffle-deploy-registry');
const YFLink = artifacts.require("YFLink");
const WrappedOne = artifacts.require("WrappedOne");

module.exports = function (deployer) {
    if (deployer.network === 'development') {
        deployer.deploy(YFLink).then((yflInstance) => {
            return tdr.appendInstance(yflInstance);
        });
        deployer.deploy(WrappedOne).then((woneInstance) => {
            return tdr.appendInstance(woneInstance);
        });
    } else if (deployer.network === 'testnet') {
        deployer.deploy(YFLink).then((yflInstance) => {
            return tdr.appendInstance(yflInstance);
        });
    }
};
