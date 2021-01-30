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
    uint constant BAKE_DURATION = 60 * 60 * 24;
    uint constant CUSTOMIZE_DURATION = 60 * 60 * 24;
    uint constant CUSTOMIZATION_STEPS_COUNT = 6;
    uint constant CUSTOMIZATION_STEP_WINDOW_DURATION = 60 * 60;
    uint[CUSTOMIZATION_STEPS_COUNT] CUSTOMIZATION_STEP_WINDOWS = [
        0,
        60 * 60,
        60 * 60 * 9,
        60 * 60 * 17,
        60 * 60 * 24,
        0
    ];
    uint CREATE_WAFFLE_CURRENCY_COST = 5000000000000000;

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
        uint oneCost;
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
        require(msg.sender == owner);
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
        require((block.timestamp < waffles[_waffleId].processEnd) == _positive, "Waffle already being processed");
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

    function createTopping (string memory _name, uint _oneCost) external isOwner {
        toppings.push(WaffleItem(_name, _oneCost));
    }

    function createBase (string memory _name, uint _oneCost) external isOwner {
        bases.push(WaffleItem(_name, _oneCost));
    }

    function createExtra (string memory _name, uint _oneCost) external isOwner {
        extras.push(WaffleItem(_name, _oneCost));
    }

    function createPlate (string memory _name, uint _oneCost) external isOwner {
        plates.push(WaffleItem(_name, _oneCost));
    }

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
        addWaffleLayer(_waffleId);
        waffles[_waffleId].processEnd = block.timestamp + BAKE_DURATION;
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
        competitionIsOngoing
        waffleExists(_waffleId)
        senderOwnsWaffle(true, _waffleId)
        waffleIsBeingProcessed(false, _waffleId)
    {
        require(waffles[_waffleId].customizationStep == CustomizationStep.NOT_CUSTOMIZED, "Last layer must not already be customized");
        require(_baseId < bases.length, "Invalid base");
        require(_toppingId < toppings.length, "Invalid topping");

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
        spendCustomizationCosts(_waffleId, _baseId, _toppingId, _extraId, _plateId);
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
        require(block.timestamp > customizationWindowStart, 'Not within the customization window');
        require(block.timestamp < customizationWindowEnd, 'Waffle burned');

        calculateNextWaffleCustomizationStep(_waffleId);
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
            uint leaderboardWaffleId = leaderboardWaffleIds[i];
            // find where to insert the new score
            if (waffles[leaderboardWaffleId].votes < votes) {
                for (uint j = i + 1; j < LEADERBOARD_WAFFLE_COUNT + 1; j++) {
                    uint nextLeaderboardWaffleId = leaderboardWaffleIds[j];
                    leaderboardWaffleIds[j] = leaderboardWaffleId;
                    leaderboardWaffleId = nextLeaderboardWaffleId;
                }

                // insert
                leaderboardWaffleIds[i] = _waffleId;

                // delete last from list
                delete leaderboardWaffleIds[LEADERBOARD_WAFFLE_COUNT];

                return;
            }
        }
    }


    /**
    *   Returns the address of the creator of a waffle
    **/
    function getWaffleOwner(uint _waffleId)
        public
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

    function stringIsNotEmpty(string memory _str) internal view returns(bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length > 0;
    }

    function stringSizeLowerOrEqual(string memory _str, uint _size) internal view returns(bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length <= _size;
    }

    function spendCurrency(uint amount) internal {
        uint poolAmount = amount.mul(PRIZE_POOL_COST_PERCENTAGE).div(100);
        uint devAmount = amount - poolAmount;
        currency.transferFrom(address(msg.sender), grandPrize, poolAmount);
        currency.transferFrom(address(msg.sender), dev, devAmount);
    }

    function spendONE(uint amount) internal {
        uint poolAmount = amount.mul(PRIZE_POOL_COST_PERCENTAGE).div(100);
        uint devAmount = amount - poolAmount;
        grandPrize.transfer(poolAmount);
        dev.transfer(devAmount);
    }

    function spendCustomizationCosts
        (
            uint _waffleId,
            uint _baseId,
            uint _toppingId,
            uint _extraId,
            uint _plateId
        )
        internal
    {
        uint oneCost = 0;
        if (waffles[_waffleId].layersCount <= 1) {
            oneCost.add(plates[_plateId].oneCost);
            oneCost.add(extras[_extraId].oneCost);
        }
        oneCost.add(bases[_baseId].oneCost);
        oneCost.add(toppings[_toppingId].oneCost);
        spendONE(oneCost);
    }

    function addWaffleLayer(uint _waffleId) internal {
        require(waffles[_waffleId].layersCount < MAX_WAFFLE_LAYERS, "You can't add more layers to this waffle");
        spendCurrency(CREATE_WAFFLE_CURRENCY_COST);
        waffles[_waffleId].layers[waffles[_waffleId].layersCount++] = WaffleLayer(0,0);
        waffles[_waffleId].customizationStep = CustomizationStep.NOT_CUSTOMIZED;
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
