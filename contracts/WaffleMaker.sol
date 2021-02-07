//SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WaffleMaker {
    using SafeMath for uint;

    uint constant PRIZE_POOL_COST_PERCENTAGE = 90; // The rest is given to the owner address as a dev fee
    uint constant MAX_NAME_BYTES = 20;
    uint constant MAX_DESCRIPTION_BYTES = 75;
    uint constant MAX_WAFFLE_LAYERS = 5;
    uint constant MAX_VOTES_PER_ACCOUNT = 3;
    uint constant LEADERBOARD_WAFFLE_COUNT = 10;
    uint constant COMPETITION_DURATION = 60 * 60 * 24 * 30;
    uint constant BAKE_DURATION = 10;//60 * 60 * 24;
    uint constant CUSTOMIZE_DURATION = 120;//60 * 60 * 24;
    uint constant CUSTOMIZATION_STEPS_COUNT = 6;
    uint constant CUSTOMIZATION_STEP_WINDOW_DURATION = 30;//60 * 60;
    uint constant CREATE_WAFFLE_CURRENCY_COST = 5 * 10 ** 15;
    uint[CUSTOMIZATION_STEPS_COUNT] CUSTOMIZATION_STEP_WINDOWS = [
        0,//0,
        30,//60 * 60,
        60,//60 * 60 * 9,
        90,//60 * 60 * 17,
        120,//60 * 60 * 24,
        0
    ];

    address public owner;
    address payable public grandPrize;
    address payable public dev;
    uint public competitionEndTimestamp;
    ERC20 currency; // Asset used to pay for waffle creation

    WaffleItem[] public toppings;
    WaffleItem[] public bases;
    WaffleItem[] public plates;
    WaffleItem[] public extras;

    Waffle[] waffles;
    uint[] publishedWaffleIds;
    mapping (uint => uint) public leaderboardWaffleIds;
    mapping(address => AccountProfile) profiles;
    uint finalGasPrizeAmount;
    uint finalCurrencyPrizeAmount;
    bool competitionConcluded = false;

    event CreateWaffle(address owner, uint waffleId);
    event BakeWaffleLayer(address owner, uint waffleId);
    event SubmitWaffleCustomization(
        address owner,
        uint waffleId,
        uint baseId,
        uint toppingId,
        uint extraId,
        uint plateId
    );
    event AdvanceWaffleCustomizationStep(address owner, uint waffleId);
    event PublishWaffle(address owner, uint waffleId);
    event VoteWaffle(address owner, uint waffleId);

    enum CustomizationStep {
        NOT_CUSTOMIZED,
        PLATE,
        BASE,
        TOPPING,
        EXTRA,
        DONE
    }

    struct WaffleItem {
        string name;
        uint gasCost;
    }

    struct WaffleLayer {
        uint baseId;
        uint toppingId;
    }

    struct Waffle {
        address owner;
        uint votes;
        string name;
        string description;
        uint plateId;
        uint extraId;
        mapping(uint => WaffleLayer) layers;
        uint layersCount;
        bool published;
        CustomizationStep customizationStep;
        uint processEnd; // Saves the Unix timestamp at which either the baking or customization ends
    }

    struct AccountProfile {
        mapping(uint => uint) ownedWaffleIds;
        uint ownedWafflesCount;
        mapping(uint => uint) votedWaffleIds;
        uint votedWafflesCount;
        bool canVote;
    }

    // ******************** MODIFIERS ***********************\
    modifier isOwner {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier competitionIsOngoing {
        require(block.timestamp < competitionEndTimestamp, "Competition must be ongoing");
        _;
    }

    modifier competitionHasEnded {
        require(block.timestamp >= competitionEndTimestamp, "Competition must have ended");
        _;
    }

    modifier waffleExists(uint _waffleId) {
        require(_waffleId < waffles.length, "This waffle doesn't exist");
        _;
    }

    modifier waffleIsBeingProcessed(bool _positive, uint _waffleId) {
        require((block.timestamp < waffles[_waffleId].processEnd) == _positive, "Invalid waffle processing state");
        _;
    }

    modifier waffleIsPublished(bool _positive, uint _waffleId) {
        require(waffles[_waffleId].published == _positive, "Invalid published state");
        _;
    }

    modifier senderOwnsWaffle(bool _positive, uint _waffleId) {
        bool waffleOwned = false;
        for (uint i = 0; i < profiles[msg.sender].ownedWafflesCount; i++) {
            if (profiles[msg.sender].ownedWaffleIds[i] == _waffleId) {
                waffleOwned = true;
            }
        }
        require(waffleOwned == _positive, "Invalid waffle owner");
        _;
    }

    constructor (ERC20 _currency, address _grandPrize, address _dev) public {
        require(_grandPrize != address(0), "_grandPrize is zero");
        require(_dev != address(0), "_dev is zero");

        owner = msg.sender;
        grandPrize = payable(_grandPrize);
        dev = payable(_dev);
        competitionEndTimestamp = block.timestamp + COMPETITION_DURATION;
        currency = _currency;

        bases.push(WaffleItem('Empty', 0));
        toppings.push(WaffleItem('Empty', 0));
        plates.push(WaffleItem('Plain Plate', 0));
        extras.push(WaffleItem('Empty', 0));
    }

    /**
    *   Add a new topping that can be used by waffles
    **/
    function createTopping (string memory _name, uint _gasCost) external isOwner {
        toppings.push(WaffleItem(_name, _gasCost));
    }

    /**
    *   Add a new base that can be used by waffles
    **/
    function createBase (string memory _name, uint _gasCost) external isOwner {
        bases.push(WaffleItem(_name, _gasCost));
    }

    /**
    *   Add a new extra that can be used by waffles
    **/
    function createExtra (string memory _name, uint _gasCost) external isOwner {
        extras.push(WaffleItem(_name, _gasCost));
    }

    /**
    *   Add a new plate that can be used by waffles
    **/
    function createPlate (string memory _name, uint _gasCost) external isOwner {
        plates.push(WaffleItem(_name, _gasCost));
    }

    /**
    *   Bake a new waffle with a BAKE_DURATION time to completion
    *
    *   Costs CREATE_WAFFLE_CURRENCY_COST of the contract currency
    **/
    function createWaffle() external competitionIsOngoing {
        waffles.push(Waffle({
            owner: msg.sender,
            votes: 0,
            name: "",
            description: "",
            plateId: 0,
            extraId: 0,
            layersCount: 0,
            published: false,
            processEnd: block.timestamp + BAKE_DURATION,
            customizationStep: CustomizationStep.NOT_CUSTOMIZED
        }));
        addWaffleLayer(waffles.length - 1);

        profiles[msg.sender].ownedWaffleIds[profiles[msg.sender].ownedWafflesCount++] = waffles.length - 1;
        emit CreateWaffle(msg.sender, waffles.length - 1);
    }

    /**
    *   Add a new layer to the waffleId provided if the waffle is owned by the sender and if last
    *   layer has been customized
    **/
    function bakeWaffleLayer(uint _waffleId)
        external
        competitionIsOngoing
        waffleExists(_waffleId)
        senderOwnsWaffle(true, _waffleId)
        waffleIsBeingProcessed(false, _waffleId)
    {
        require(waffles[_waffleId].customizationStep == CustomizationStep.DONE, "Last layer must be customized");
        waffles[_waffleId].processEnd = block.timestamp + BAKE_DURATION;
        addWaffleLayer(_waffleId);
        emit BakeWaffleLayer(msg.sender, _waffleId);
    }

    /**
    *   Submit the customization for the top layer of a waffle if the top layer is not yet customized
    *
    *   Every layer can be given a base and a topping, but only the first layer can be given an extra and a plate
    **/
    function submitWaffleCustomization
        (
            uint _waffleId,
            string memory _name,
            string memory _description,
            uint _baseId,
            uint _toppingId,
            uint _extraId,
            uint _plateId
        )
        external
        payable
        competitionIsOngoing
        waffleExists(_waffleId)
        senderOwnsWaffle(true, _waffleId)
        waffleIsBeingProcessed(false, _waffleId)
    {
        require(waffles[_waffleId].customizationStep == CustomizationStep.NOT_CUSTOMIZED, "Last layer must not already be customized");
        require(_baseId < bases.length, "Invalid base");
        require(_toppingId < toppings.length, "Invalid topping");

        checkCustomizationCosts(_waffleId, _baseId, _toppingId, _extraId, _plateId);
        if (waffles[_waffleId].layersCount <= 1) {
            require(stringIsNotEmpty(_name), "Waffle name can't be empty");
            require(stringSizeLowerOrEqual(_name, MAX_NAME_BYTES), "Max name length exceeded");
            require(stringSizeLowerOrEqual(_description, MAX_DESCRIPTION_BYTES), "Max description length exceeded");
            require(_extraId < extras.length, "Invalid extra");
            require(_plateId < plates.length, "Invalid plate");

            waffles[_waffleId].name = _name;
            waffles[_waffleId].description = _description;
            waffles[_waffleId].plateId = _plateId;
            waffles[_waffleId].extraId = _extraId;
        }
        uint lastLayerIndex = waffles[_waffleId].layersCount - 1;
        waffles[_waffleId].layers[lastLayerIndex].baseId = _baseId;
        waffles[_waffleId].layers[lastLayerIndex].toppingId = _toppingId;

        waffles[_waffleId].processEnd = block.timestamp + CUSTOMIZE_DURATION;
        calculateNextWaffleCustomizationStep(_waffleId);
        emit SubmitWaffleCustomization(msg.sender, _waffleId, _baseId, _toppingId, _extraId, _plateId);
    }

    /**
    *   Adds the ingredient of a waffle if within a customization window
    *
    *   This needs to be called once for every ingredient added to a waffle
    *
    *   If not called in time, the waffle will burn
    **/
    function advanceWaffleCustomizationStep(uint _waffleId)
        external
        competitionIsOngoing
        waffleExists(_waffleId)
        senderOwnsWaffle(true, _waffleId)
        waffleIsPublished(false, _waffleId)
    {
        require(waffles[_waffleId].customizationStep < CustomizationStep.DONE, 'All customization steps done');
        uint stepNumber = uint(waffles[_waffleId].customizationStep);
        uint processStart = waffles[_waffleId].processEnd - CUSTOMIZE_DURATION;
        uint customizationWindowEnd = processStart + CUSTOMIZATION_STEP_WINDOWS[stepNumber];
        uint customizationWindowStart = customizationWindowEnd - CUSTOMIZATION_STEP_WINDOW_DURATION;
        require(block.timestamp > customizationWindowStart, 'Cannot advance customization step yet');
        require(block.timestamp < customizationWindowEnd, 'Waffle burned');

        calculateNextWaffleCustomizationStep(_waffleId);
        emit AdvanceWaffleCustomizationStep(msg.sender, _waffleId);
    }

    /**
    *   Makes a waffle available for voting and blocks further customization
    **/
    function publishWaffle(uint _waffleId)
        external
        competitionIsOngoing
        waffleExists(_waffleId)
        senderOwnsWaffle(true, _waffleId)
        waffleIsPublished(false, _waffleId)
        waffleIsBeingProcessed(false, _waffleId)
    {
        require(waffles[_waffleId].customizationStep == CustomizationStep.DONE, 'At least one layer must be customized');
        waffles[_waffleId].published = true;
        publishedWaffleIds.push(_waffleId);
        profiles[msg.sender].canVote = true;
        emit PublishWaffle(msg.sender, _waffleId);
    }

    /**
    *   Cast a vote for the waffleId provided from the sender account.
    *
    *   Waffle must be published by calling publishWaffle to be voted on
    *
    *   No more than MAX_VOTES_PER_ACCOUNT votes can be cast per account.
    **/
    function voteWaffle(uint _waffleId)
        external
        competitionIsOngoing
        waffleExists(_waffleId)
        senderOwnsWaffle(false, _waffleId)
        waffleIsPublished(true, _waffleId)
    {
        require(profiles[msg.sender].canVote, "Must have published at least one waffle to vote");
        require(profiles[msg.sender].votedWafflesCount < MAX_VOTES_PER_ACCOUNT, "Max votes on this account exceeded");
        require(!addressHasVotedOnWaffle(msg.sender, _waffleId), "Can't vote for the same waffle twice");

        waffles[_waffleId].votes++;
        profiles[msg.sender].votedWaffleIds[profiles[msg.sender].votedWafflesCount++] = _waffleId;

        uint votes = waffles[_waffleId].votes;
        uint lastWaffleId = leaderboardWaffleIds[LEADERBOARD_WAFFLE_COUNT - 1];
        if (waffles[lastWaffleId].votes >= votes) return;
        for (uint i = 0; i < LEADERBOARD_WAFFLE_COUNT; i++) {
            // find where to insert the new score
            if (waffles[leaderboardWaffleIds[i]].votes < votes) {
                for (uint j = LEADERBOARD_WAFFLE_COUNT; i < j; j--) {
                    leaderboardWaffleIds[j] = leaderboardWaffleIds[j - 1];
                }
                // insert
                leaderboardWaffleIds[i] = _waffleId;
                // delete last from list
                delete leaderboardWaffleIds[LEADERBOARD_WAFFLE_COUNT];
                return;
            }
        }
        emit VoteWaffle(msg.sender, _waffleId);
    }

    /**
    *   Transfer the accumulated funds to the dev address and the grand prize address
    *   and save the final prize pool values
    *
    *   Can be called by anyone
    **/
    function concludeCompetition()
        external
        // competitionHasEnded
    {
        uint gasBalance = address(this).balance;
        uint poolGasAmount = gasBalance.mul(PRIZE_POOL_COST_PERCENTAGE).div(100);
        uint devGasAmount = gasBalance - poolGasAmount;

        uint currencyBalance = currency.balanceOf(address(this));
        uint poolCurrencyAmount = currencyBalance.mul(PRIZE_POOL_COST_PERCENTAGE).div(100);
        uint devCurrencyAmount = currencyBalance - poolCurrencyAmount;

        competitionConcluded = true;
        finalGasPrizeAmount = poolGasAmount;
        finalCurrencyPrizeAmount = poolCurrencyAmount;

        grandPrize.transfer(poolGasAmount);
        dev.transfer(devGasAmount);
        currency.transferFrom(address(this), grandPrize, poolCurrencyAmount);
        currency.transferFrom(address(this), dev, devCurrencyAmount);
    }


    /**
    *
    **/
    function getGasPrizeAmount() external view returns(uint)
    {
        if (competitionConcluded) {
            return finalGasPrizeAmount;
        } else {
            uint gasBalance = address(this).balance;
            return gasBalance.mul(PRIZE_POOL_COST_PERCENTAGE).div(100);
        }
    }

    /**
    *
    **/
    function getCurrencyPrizeAmount() external view returns(uint)
    {
        if (competitionConcluded) {
            return finalCurrencyPrizeAmount;
        } else {
            uint currencyBalance = currency.balanceOf(address(this));
            return currencyBalance.mul(PRIZE_POOL_COST_PERCENTAGE).div(100);
        }
    }

    /**
    *   Returns the address of the creator of a waffle
    **/
    function getWaffleOwner(uint _waffleId)
        external
        view
        waffleExists(_waffleId)
        returns (address)
    {
        return waffles[_waffleId].owner;
    }

    /**
    *   Returns the data of the waffle associated to a waffle id
    **/
    function getWaffleInfo(uint _waffleId)
        public
        view
        waffleExists(_waffleId)
        returns (
            uint id,
            string memory name,
            string memory description,
            uint votes,
            uint extraId,
            uint plateId,
            uint processEnd,
            bool published,
            CustomizationStep customizationStep,
            WaffleLayer[] memory layers
        )
    {
        Waffle memory waffle = waffles[_waffleId];
        WaffleLayer[] memory waffleLayers = new WaffleLayer[](waffle.layersCount);
        for (uint i = 0; i < waffle.layersCount; i++) {
            waffleLayers[i] = waffles[_waffleId].layers[i];
        }
        return (
            _waffleId,
            waffle.name,
            waffle.description,
            waffle.votes,
            waffle.extraId,
            waffle.plateId,
            waffle.processEnd,
            waffle.published,
            waffle.customizationStep,
            waffleLayers
        );
    }

    /**
    *   Returns the data of the waffle associated to a published waffle index
    **/
    function getPublishedWaffleInfo(uint _publishedWaffleIndex)
        external
        view
        returns (
            uint id,
            string memory name,
            string memory description,
            uint votes,
            uint extraId,
            uint plateId,
            uint processEnd,
            bool published,
            CustomizationStep customizationStep,
            WaffleLayer[] memory layers
        )
    {
        require(_publishedWaffleIndex < publishedWaffleIds.length, "Published waffle doesn't exist");
        uint waffleId = publishedWaffleIds[_publishedWaffleIndex];
        return getWaffleInfo(waffleId);
    }

    /**
    *   Returns the data of the waffle associated to a leaderboard index
    **/
    function getLeaderboardWaffleInfo(uint _leaderboardWaffleIndex)
        external
        view
        returns (
            uint id,
            string memory name,
            string memory description,
            uint votes,
            uint extraId,
            uint plateId,
            uint processEnd,
            bool published,
            CustomizationStep customizationStep,
            WaffleLayer[] memory layers
        )
    {
        require(_leaderboardWaffleIndex < LEADERBOARD_WAFFLE_COUNT && _leaderboardWaffleIndex < waffles.length, "Leaderboard waffle doesn't exist");
        uint waffleId = leaderboardWaffleIds[_leaderboardWaffleIndex];
        return getWaffleInfo(waffleId);
    }

    /**
    *   Returns the profile data associated to an address
    **/
    function getProfileInfo(address _addr)
        external
        view
        returns (
            uint[] memory ownedWaffleIds,
            uint[] memory votedWaffleIds,
            bool canVote
        )
    {
        uint[] memory profileOwnedWaffles = new uint[](profiles[_addr].ownedWafflesCount);
        for (uint i = 0; i < profiles[_addr].ownedWafflesCount; i++) {
            profileOwnedWaffles[i] = profiles[_addr].ownedWaffleIds[i];
        }

        uint[] memory profileVotedWaffles = new uint[](profiles[_addr].votedWafflesCount);
        for (uint i = 0; i < profiles[_addr].votedWafflesCount; i++) {
            profileVotedWaffles[i] = profiles[_addr].votedWaffleIds[i];
        }
        return (profileOwnedWaffles, profileVotedWaffles, profiles[_addr].canVote);
    }

    /**
    *   Returns the number of published waffles
    **/
    function getPublishedWafflesCount() external view returns(uint) {
        return publishedWaffleIds.length;
    }

    /**
    *   Returns the number of possible toppings for waffles
    **/
    function getToppingsCount() external view returns(uint) {
        return toppings.length;
    }

    /**
    *   Returns the number of possible bases for waffles
    **/
    function getBasesCount() external view returns(uint) {
        return bases.length;
    }

    /**
    *   Returns the number of possible plates for waffles
    **/
    function getPlatesCount() external view returns(uint) {
        return plates.length;
    }

    /**
    *   Returns the number of possible extras for waffles
    **/
    function getExtrasCount() external view returns(uint) {
        return extras.length;
    }


    function getWaffleLayers(uint _waffleId) internal view returns(WaffleLayer[] memory) {
        uint layersCount = waffles[_waffleId].layersCount;
        WaffleLayer[] memory waffleLayers = new WaffleLayer[](layersCount);
        for (uint i = 0; i < layersCount; i++) {
            waffleLayers[i] = waffles[_waffleId].layers[i];
        }
        return waffleLayers;
    }

    function stringIsNotEmpty(string memory _str) internal pure returns(bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length > 0;
    }

    function stringSizeLowerOrEqual(string memory _str, uint _size) internal pure returns(bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length <= _size;
    }

    function spendCurrency(uint amount) internal {
        uint balance = currency.balanceOf(address(msg.sender));
        require(balance >= amount, "Currency balance too low for this action");
        uint allowance = currency.allowance(address(msg.sender), address(this));
        require(allowance >= amount, "Currency allowance too low for this action");

        bool returnValue = currency.transferFrom(address(msg.sender), address(this), amount);
        require(returnValue, "Something went wrong in the currency transfer");
    }

    function checkCustomizationCosts
        (
            uint _waffleId,
            uint _baseId,
            uint _toppingId,
            uint _extraId,
            uint _plateId
        )
        internal
    {
        uint gasCost = 0;
        if (waffles[_waffleId].layersCount <= 1) {
            gasCost = gasCost.add(plates[_plateId].gasCost + extras[_extraId].gasCost);
        }
        gasCost = gasCost.add(bases[_baseId].gasCost + toppings[_toppingId].gasCost);

        require(msg.sender.balance >= gasCost, "Gas balance too low for this customization");
        require(msg.value == gasCost, "Sent value doesn't match expected value for this waffle customization");
    }

    function addWaffleLayer(uint _waffleId) internal {
        require(waffles[_waffleId].layersCount < MAX_WAFFLE_LAYERS, "You can't add more layers to this waffle");
        waffles[_waffleId].layers[waffles[_waffleId].layersCount++] = WaffleLayer(0,0);
        waffles[_waffleId].customizationStep = CustomizationStep.NOT_CUSTOMIZED;
        spendCurrency(CREATE_WAFFLE_CURRENCY_COST);
    }

    function waffleCustomizationStepCanBeSkipped(uint _waffleId) internal view returns(bool) {
        if (waffles[_waffleId].layersCount == 1) {
            if (waffles[_waffleId].customizationStep == CustomizationStep.PLATE && waffles[_waffleId].plateId == 0) {
                return true;
            } else if(waffles[_waffleId].customizationStep == CustomizationStep.EXTRA && waffles[_waffleId].extraId == 0) {
                return true;
            } else if(waffles[_waffleId].customizationStep == CustomizationStep.BASE && waffles[_waffleId].layers[waffles[_waffleId].layersCount - 1].baseId == 0) {
                return true;
            } else if(waffles[_waffleId].customizationStep == CustomizationStep.TOPPING && waffles[_waffleId].layers[waffles[_waffleId].layersCount - 1].toppingId == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            if (waffles[_waffleId].customizationStep == CustomizationStep.PLATE) {
                return true;
            } else if(waffles[_waffleId].customizationStep == CustomizationStep.EXTRA) {
                return true;
            } else if(waffles[_waffleId].customizationStep == CustomizationStep.BASE && waffles[_waffleId].layers[waffles[_waffleId].layersCount - 1].baseId == 0) {
                return true;
            } else if(waffles[_waffleId].customizationStep == CustomizationStep.TOPPING && waffles[_waffleId].layers[waffles[_waffleId].layersCount - 1].toppingId == 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    function calculateNextWaffleCustomizationStep(uint _waffleId) internal {
        do {
            uint newStepNumber = uint(waffles[_waffleId].customizationStep) + 1;
            waffles[_waffleId].customizationStep = CustomizationStep(newStepNumber);
        } while (waffleCustomizationStepCanBeSkipped(_waffleId));
    }

    function addressHasVotedOnWaffle(address _addr, uint _waffleId) internal view returns(bool) {
        for (uint i = 0; i < profiles[_addr].votedWafflesCount; i++) {
            if (profiles[_addr].votedWaffleIds[i] == _waffleId) {
                return true;
            }
        }
        return false;
    }
}
