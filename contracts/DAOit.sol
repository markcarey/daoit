// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./token/DAOToken.sol";

import "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";
import "./governance/Governor.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import './DAOSuperApp.sol';

contract DAOExecutor is TimelockControllerUpgradeable {
    constructor() initializer {}

    function initialize(uint256 minDelay, address[] memory proposers, address[] memory executors)
        initializer public
    {
        __TimelockController_init(minDelay, proposers, executors);
    }
}


contract DAOFactory is Initializable {
    address superAppImplementation;
    address tokenImplementation;
    address governorImplementation;
    address timelockImplementation;
    address owner;

    ISuperTokenFactory private _superTokenFactory;

    constructor() {}

    function initialize(
        address _superTokenFactoryAddress,
        address _superAppImplementation,
        address _tokenImplementation,
        address _governorImplementation,
        address _timelockImplementation
    ) initializer public {
        _superTokenFactory = ISuperTokenFactory(_superTokenFactoryAddress);
        superAppImplementation = _superAppImplementation;
        tokenImplementation = _tokenImplementation;
        governorImplementation = _governorImplementation;
        timelockImplementation = _timelockImplementation;
        owner = msg.sender;
    }

    event DAOSuperAppCreated(
        address indexed _owner,
        address superApp,
        address underlying,
        address superToken
    );

    function createDAOSuperApp(
        string memory name, 
        string calldata symbol, 
        address accepted,
        address weth,
        address host,
        address cfa,
        address router
    ) external returns (address) {
        // step 1: create super token
        DAOToken daoToken = _createDaoToken(name, symbol);
        // step 2: create Super wrapper:
        ISuperToken superDaoToken = _createSuperToken(daoToken, name, symbol);
        // step 3: create super app
        address superApp = _createSuperApp(name, symbol);
        // step 3.5: register the Super App
        uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;
        ISuperfluid(host).registerAppByFactory(ISuperApp(superApp), configWord);
        // step 4: initialize dao token
        _initDaoToken(daoToken, name, symbol, superApp);
        // step 4: initialize superApp
        address futureTimelock = Clones.predictDeterministicAddress(timelockImplementation, keccak256(abi.encodePacked(address(daoToken))), address(this));
        _initSuperApp(
            superApp,
            daoToken, 
            superDaoToken, 
            futureTimelock, 
            accepted,
            weth,
            host,
            cfa,
            router
        );
        emit DAOSuperAppCreated(msg.sender, address(superApp), address(daoToken), address(superDaoToken));
        return superApp;
    }

    function _createDaoToken(string memory name, string memory symbol) internal returns(DAOToken) {
        bytes32 salt = keccak256(abi.encodePacked(name, symbol));
        DAOToken daoToken = DAOToken(address(Clones.cloneDeterministic(tokenImplementation, salt)));
        return daoToken;
    }

    function _createSuperToken(DAOToken daoToken, string memory name, string memory symbol) internal returns(ISuperToken) {
        ISuperToken superDaoToken = _superTokenFactory.createERC20Wrapper(IERC20(address(daoToken)), uint8(18), ISuperTokenFactory.Upgradability.FULL_UPGRADABE, string(abi.encodePacked("Super ", name)), string(abi.encodePacked(symbol, "x")));
        return superDaoToken;
    }

    function _createSuperApp(string memory name, string memory symbol) internal returns(address) {
        bytes32 salt = keccak256(abi.encodePacked(name, symbol));
        return Clones.cloneDeterministic(superAppImplementation, salt);
    }

    function _initDaoToken(DAOToken daoToken, string memory name, string memory symbol, address superApp) internal {
        daoToken.initialize(
            name,
            symbol,
            superApp
        );
    }

    function _initSuperApp(
        address superApp,
        DAOToken daoToken, 
        ISuperToken superDaoToken, 
        address futureTimelock, 
        address accepted,
        address weth,
        address host,
        address cfa,
        address router
    ) internal {
        DAOSuperApp(superApp).initialize(
            address(daoToken), 
            address(superDaoToken), 
            msg.sender, 
            futureTimelock, 
            accepted,
            weth,
            host,
            cfa,
            router
        );
    }

    event DAOGovernorCreated(
        address indexed _owner,
        address _contract,
        address _timelock
    );

    function createGoverance(address token, bool vetoable, uint256 votingPeriod) external returns(address) {
        bytes32 salt = keccak256(abi.encodePacked(token));
        DAOExecutor timelock = DAOExecutor( payable(Clones.cloneDeterministic(timelockImplementation, salt)) );
        DAOGovernor governor = DAOGovernor( payable(Clones.cloneDeterministic(governorImplementation, salt)) );

        address[] memory proposers = new address[](2);
        proposers[0] = address(governor);
        proposers[1] = address(governor);
        if (vetoable) {
            proposers[1] = msg.sender;
        }
        address[] memory executors = new address[](1);
        executors[0] = address(0); // anyone can execute if proposal succeeded and ready
        governor.initialize(ERC20VotesUpgradeable(token), timelock, votingPeriod);
        governor.transferOwnership(msg.sender);
        timelock.initialize(60*30, proposers, executors); // TODO: change delay to variable
        emit DAOGovernorCreated(msg.sender, address(governor), address(timelock));
        return address(governor);
    }

}
