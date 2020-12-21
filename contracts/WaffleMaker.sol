pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WaffleMaker {
    uint constant MAX_NAME_BYTES = 20;
    uint constant MAX_DESCRIPTION_BYTES = 75;
    uint constant MAX_WAFFLE_LAYERS = 5;
    uint constant MAX_VOTES_PER_ACCOUNT = 3;
    uint constant COMPETITION_DURATION = 60 * 60 * 24 * 30;
    uint constant BAKE_DURATION = 10;//60 * 60 * 24;
    uint constant CUSTOMIZE_DURATION = 120;//60 * 60 * 24;
    uint constant CUSTOMIZATION_STEPS_COUNT = 6;
    uint constant CUSTOMIZATION_STEP_WINDOW_DURATION = 30;//60 * 60;
    uint24[CUSTOMIZATION_STEPS_COUNT] CUSTOMIZATION_STEP_WINDOWS = [
    0,//0,
    30,//60 * 60,
    60,//60 * 60 * 9,
    90,//60 * 60 * 17,
    120,//60 * 60 * 24,
    0
    ];
    uint CREATE_WAFFLE_YFL_COST = 5000000000000000;

    address public admin; // Also the address to which the 10% dev fund is sent to
    uint public competitionEndTimestamp;
    ERC20 yfl;
    ERC20 wone;

    WaffleItem[] public toppings;
    WaffleItem[] public bases;
    WaffleItem[] public plates;
    WaffleItem[] public extras;

    Waffle[] waffles;
    uint[] publishedWaffleIds;
    mapping(address => AccountProfile) profiles;
    bool competitionConcluded;

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
        uint price;
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

    // ******************** MODIFIERS ***********************
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

    constructor(ERC20 _yfl, ERC20 _wone) public {
        admin = msg.sender;
        competitionEndTimestamp = block.timestamp + COMPETITION_DURATION;
        yfl = _yfl;
        wone = _wone;

        toppings.push(WaffleItem('Empty', 0));
        bases.push(WaffleItem('Empty', 0));
        plates.push(WaffleItem('Plain Plate', 0));
        extras.push(WaffleItem('Empty', 0));
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

        if (waffles[_waffleId].layersCount <= 1) {
            require(stringIsNotEmpty(_name), "Waffle name can't be empty");
            require(stringSizeLowerOrEqual(_name, MAX_NAME_BYTES), "Max name length exceeded");
            require(stringSizeLowerOrEqual(_description, MAX_DESCRIPTION_BYTES), "Max description length exceeded");

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
    }

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
    }

    /**
    *   Concludes the competition and distributes the rewards to the owner
    *   of the waffle with the most votes
    *
    *   Can be called by anyone past the competition end timestamp
    **/
    function concludeCompetition() external competitionHasEnded {
        require(!competitionConcluded, "Competition has already been concluded");

        competitionConcluded = true;
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

    function getPublishedWafflesCount() external view returns(uint) {
        return publishedWaffleIds.length;
    }


    function getWaffleLayers(uint _waffleId) view internal returns(WaffleLayer[] memory) {
        uint layersCount = waffles[_waffleId].layersCount;
        WaffleLayer[] memory waffleLayers = new WaffleLayer[](layersCount);
        for (uint i = 0; i < layersCount; i++) {
            waffleLayers[i] = waffles[_waffleId].layers[i];
        }
        return waffleLayers;
    }

    function stringIsNotEmpty(string memory _str) internal returns(bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length > 0;
    }

    function stringSizeLowerOrEqual(string memory _str, uint _size) internal returns(bool) {
        bytes memory strBytes = bytes(_str);
        return strBytes.length <= _size;
    }

    function addWaffleLayer(uint _waffleId) internal {
        require(waffles[_waffleId].layersCount < MAX_WAFFLE_LAYERS, "You can't add more layers to this waffle");
        // yfl.transferFrom(address(msg.sender), address(this), CREATE_WAFFLE_YFL_COST);
        waffles[_waffleId].layers[waffles[_waffleId].layersCount++] = WaffleLayer(0,0);
        waffles[_waffleId].customizationStep = CustomizationStep.NOT_CUSTOMIZED;
    }

    function waffleCustomizationStepCanBeSkipped(uint _waffleId) internal returns(bool) {
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

    function addressHasVotedOnWaffle(address _addr, uint _waffleId) internal returns(bool) {
        for (uint i = 0; i < profiles[_addr].votedWafflesCount; i++) {
            if (profiles[_addr].votedWaffleIds[i] == _waffleId) {
                return true;
            }
        }
        return false;
    }
}
