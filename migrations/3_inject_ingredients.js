const WaffleMaker = artifacts.require("WaffleMaker");
const waffleToppings = require('../lists/waffle-toppings.json');
const waffleBases = require('../lists/waffle-bases.json');
const wafflePlates = require('../lists/waffle-plates.json');
const waffleExtras = require('../lists/waffle-extras.json');

module.exports = function (deployer) {
    deployer.then(async () => {
        const waffleMaker = await WaffleMaker.deployed();

        const toppingsCount = await waffleMaker.getToppingsCount.call();
        for (let i = toppingsCount; i < waffleToppings.length; i++) {
            const topping = waffleToppings[i];
            await waffleMaker.createTopping(topping.name, topping.oneCost);
        }

        const basesCount = await waffleMaker.getBasesCount.call();
        for (let i = basesCount; i < waffleBases.length; i++) {
            const base = waffleBases[i];
            await waffleMaker.createBase(base.name, base.oneCost);
        }

        const platesCount = await waffleMaker.getPlatesCount.call();
        for (let i = platesCount; i < wafflePlates.length; i++) {
            const plate = wafflePlates[i];
            await waffleMaker.createPlate(plate.name, plate.oneCost);
        }

        const extrasCount = await waffleMaker.getExtrasCount.call();
        for (let i = extrasCount; i < waffleExtras.length; i++) {
            const extra = waffleExtras[i];
            await waffleMaker.createExtra(extra.name, extra.oneCost);
        }
    });
};
