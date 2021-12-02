// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.8.0;

import "hardhat/console.sol";

import {
    ISuperfluid,
    ISuperToken,
    ISuperApp,
    ISuperAgreement,
    SuperAppDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    ISuperTokenFactory
}
from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperTokenFactory.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import { 
    INativeSuperToken 
} from "./superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/INativeSuperToken.sol"; 

import { 
    NativeSuperTokenProxy 
} from "./superfluid-finance/ethereum-contracts/contracts/tokens/NativeSuperToken.sol";

import {
    SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777Upgradeable.sol";
import { IERC1820RegistryUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/introspection/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/IERC777RecipientUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./token/DAOToken.sol";

import "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";
import "./governance/Governor.sol";

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract DAOSuperApp is IERC777RecipientUpgradeable, SuperAppBase, Initializable, AccessControlEnumerableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    ISuperfluid _host;
    IConstantFlowAgreementV1 _cfa;
    DAOToken public underlying;
    ISuperToken public daoToken;
    ISuperToken private _acceptedToken; // accepted streaming inflow token
   
    mapping(address => int96) flowRates;

    bytes32 public constant MANAGER = keccak256("MANAGER_ROLE");
   
    address admin;
    address treasury;
    bool depositsEnabled;
    bool streamsEnabled;

    function initialize(
        address _underlying,
        address _daoToken,
        address owner,
        address _treasury,
        bool _depositsEnabled,
        bool _streamsEnabled
    ) public virtual initializer
    {
        require(address(_daoToken) != address(0), "daoToken is zero address");
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();
        console.log("before 1820 registry");
        IERC1820RegistryUpgradeable _erc1820 = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        _erc1820.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));

        console.log("chainid", block.chainid);
        if ( block.chainid == 137 ) {
            // Polygon
            _host = ISuperfluid(0x3E14dC1b13c488a8d5D310918780c983bD5982E7);
            _cfa = IConstantFlowAgreementV1(0x6EeE6060f715257b970700bc2656De21dEdF074C);
        }
        if ( block.chainid == 80001 ) {
            // Mumbai
            _host = ISuperfluid(0xEB796bdb90fFA0f28255275e16936D25d3418603);
            _cfa = IConstantFlowAgreementV1(0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873);
        }
        if ( block.chainid == 42 ) {
            // Kovan
            _host = ISuperfluid(0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3);
            _cfa = IConstantFlowAgreementV1(0xECa8056809e7e8db04A8fF6e4E82cD889a46FE2F);
        }
        if ( block.chainid == 4 || block.chainid == 31337 ) {
            // Rinkeby
            _host = ISuperfluid(0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6);
            _cfa = IConstantFlowAgreementV1(0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A);
        }

        console.log(address(_host), address(_cfa));

        uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;
        _host.registerAppByFactory(ISuperApp(address(this)), configWord);

        daoToken = ISuperToken(_daoToken);
        underlying = DAOToken(_underlying);
        admin = owner;
        treasury = _treasury;

        streamsEnabled = _streamsEnabled;
        depositsEnabled = _depositsEnabled;

        // upgrade half of supply
        //uint256 amt = underlying.balanceOf(address(this)).div(2); 
        //if (amt > 0) {
        //    underlying.approve(address(daoToken), amt);
        //    daoToken.upgrade(amt);
        //}

        //Access Control
        console.log("before grant default to treasury");
        _setupRole(DEFAULT_ADMIN_ROLE, treasury);
        console.log("after granting DEFAULT admin role");
        _setupRole(MANAGER, admin);
        _setupRole(MANAGER, treasury);

        // TODO: change this:
        _acceptedToken = ISuperToken(0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90); // Rinkeby fDAIx used by Superfluid

    }

    function totalSupply() external returns (uint256) {
        uint total = daoToken.totalSupply();
        uint256 bal = daoToken.balanceOf(address(this));
        return total.sub(bal);
    }

    function acceptedToken() external returns (address) {
        return address(_acceptedToken);
    }

    /// @dev Gelato resolver for updateReserves()
    function needReserves() external view returns(bool canExec, bytes memory execPayload) {
        int96 daoOutFlow = getDaoTokenNetFlow() * -1;
        uint256 currentReserves = daoToken.balanceOf(address(this));
        uint256 minReserves = uint256(uint96(daoOutFlow)).mul(2419200); // 28 days
        if ( currentReserves < minReserves ) {
            canExec = true;
            execPayload = abi.encodeWithSelector(this.updateReserves.selector);
        }
    }

    function updateReserves() external returns (uint256) {
        return _updateReserves(0);
    }

    function _updateReserves(int96 daoTokenFlowRate) internal returns (uint256) {
        int96 daoOutFlow = (getDaoTokenNetFlow() - daoTokenFlowRate) * -1;
        uint256 currentReserves = daoToken.balanceOf(address(this));
        uint256 minReserves = uint256(uint96(daoOutFlow)).mul(2419200); // 28 days
        if ( currentReserves < minReserves ) {
            uint256 newReserves = uint256(uint96(daoOutFlow)).mul(3024000); // 35 days
            uint256 amt = newReserves.sub(currentReserves);
            underlying.mint(address(this), amt);
            daoToken.upgrade(amt);
        }
        return daoToken.balanceOf(address(this));
    }

    function sharePrice() external returns (uint256) {
        return this.totalSupply().mul(100).div(_acceptedToken.balanceOf(treasury));
    }

    function deposit(uint _amount) public nonReentrant {
        require(depositsEnabled, "Deposits Disabled");
        uint256 _pool = _acceptedToken.balanceOf(treasury);
        _acceptedToken.transferFrom(msg.sender, address(this), _amount);
        _acceptedToken.transfer(treasury, _amount);
        uint256 _after = _acceptedToken.balanceOf(treasury);
        _amount = _after.sub(_pool); // Additional check for deflationary tokens
        uint256 shares = 0;
        if (this.totalSupply() == 0) {
            shares = _amount;
        } else {
            shares = (_amount.mul(this.totalSupply())).div(_pool);
        }
        underlying.mint(msg.sender, shares);
    }

    // these functions can be used to move tokens / ETH to the treasury
    function withdrawToken(address _tokenContract) external {
        IERC20Upgradeable tokenContract = IERC20Upgradeable(_tokenContract);
        tokenContract.transfer(treasury, tokenContract.balanceOf(address(this)) );
    }
    function withdrawETH() external payable {
        payable(treasury).transfer(address(this).balance);
    }

    function grant(address to, uint256 amount) external onlyRole(MANAGER) {
        // grants daoTokens to an address
        uint256 balance = underlying.balanceOf(address(this));
        if ( amount > balance) {
            amount = balance;
        }
        underlying.mint(to, amount);
    }

    /**************************************************************************
     * DAO Token Outflows
     *************************************************************************/
    /// @dev If a new stream is opened, or an existing one is opened
    function _updateOutflow(bytes calldata ctx, address customer, bytes32 agreementId)
        private
        returns (bytes memory newCtx)
    {
      newCtx = ctx;
      (,int96 inFlowRate,,) = _cfa.getFlowByID(_acceptedToken, agreementId);
      (,int96 daoTokenFlowRate,,) = _cfa.getFlow(daoToken, address(this), customer);
      (,int96 treasuryFlowRate,,) = _cfa.getFlow(_acceptedToken, address(this), treasury);
      if (inFlowRate < 0 ) inFlowRate = -inFlowRate; // Fixes issue when inFlowRate is negative

      uint256 multiplier = this.sharePrice();
      if (multiplier != 0) {
          daoTokenFlowRate = int96(int256( uint256(uint96(inFlowRate)).mul(multiplier).div(100) ));
      }
      _updateReserves(daoTokenFlowRate);

      if ( (daoTokenFlowRate != int96(0)) && (inFlowRate != int96(0)) ){
        // @dev if there already exists an outflow, then update it.
        (newCtx, ) = _host.callAgreementWithContext(
            _cfa,
            abi.encodeWithSelector(
                _cfa.updateFlow.selector,
                daoToken,
                customer,
                daoTokenFlowRate,
                new bytes(0) // placeholder
            ),
            "0x",
            newCtx
        );
        // @dev Update the outflow to treasury.
        (newCtx, ) = _host.callAgreementWithContext(
            _cfa,
            abi.encodeWithSelector(
                _cfa.updateFlow.selector,
                _acceptedToken,
                treasury,
                treasuryFlowRate + inFlowRate,
                new bytes(0) // placeholder
            ),
            "0x",
            newCtx
        );
      } else if (inFlowRate == int96(0)) {
        // @dev if inFlowRate is zero, delete outflow.
        (newCtx, ) = _host.callAgreementWithContext(
            _cfa,
            abi.encodeWithSelector(
                _cfa.deleteFlow.selector,
                daoToken,
                address(this),
                customer,
                new bytes(0) // placeholder
            ),
            "0x",
            newCtx
        );
        // @dev Reduce the outflow to treasury.
        (newCtx, ) = _host.callAgreementWithContext(
            _cfa,
            abi.encodeWithSelector(
                _cfa.updateFlow.selector,
                _acceptedToken,
                treasury,
                treasuryFlowRate - flowRates[customer],
                new bytes(0) // placeholder
            ),
            "0x",
            newCtx
        );
      } else {
          // @dev If there is no existing outflow, then create new flow to equal inflow
          (newCtx, ) = _host.callAgreementWithContext(
              _cfa,
              abi.encodeWithSelector(
                  _cfa.createFlow.selector,
                  daoToken,
                  customer,
                  daoTokenFlowRate,
                  new bytes(0) // placeholder
              ),
              "0x",
              newCtx
          );
          // @dev If there is no existing outflow, then redirect to treasury
          (newCtx, ) = _host.callAgreementWithContext(
              _cfa,
              abi.encodeWithSelector(
                  _cfa.createFlow.selector,
                  _acceptedToken,
                  treasury,
                  inFlowRate,
                  new bytes(0) // placeholder
              ),
              "0x",
              newCtx
          );
      }
      flowRates[customer] = inFlowRate;
    }
    /**************************************************************************
     * SuperApp callbacks
     *************************************************************************/
    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata /*_agreementData*/,
        bytes calldata ,// _cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        onlyIfStreamsEnabled
        returns (bytes memory newCtx)
    {
        address customer = _host.decodeCtx(_ctx).msgSender;
        console.log("b4 _updateOutflow");
        return _updateOutflow(_ctx, customer, _agreementId);
    }

    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata /*_agreementData*/,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        onlyIfStreamsEnabled
        returns (bytes memory newCtx)
    {
        console.log("start afterAgreementUpdated");
        address customer = _host.decodeCtx(_ctx).msgSender;
        return _updateOutflow(_ctx, customer, _agreementId);
    }
    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 _agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        returns (bytes memory newCtx)
    {
        console.log("start afterAgreementTerminated");
        // According to the app basic law, we should never revert in a termination callback
        if (!streamsEnabled) return _ctx;
        if (!_isSameToken(_superToken) || !_isCFAv1(_agreementClass)) return _ctx;
        if (msg.sender != address(_host)) return _ctx;
        (address customer,) = abi.decode(_agreementData, (address, address));
        (,int96 inFlowRate,,) = _cfa.getFlowByID(_superToken, _agreementId);
        console.log("inFlowRate:");
        console.logInt(inFlowRate);
        return _updateOutflow(_ctx, customer, _agreementId);
    }
    function getNetFlow() public view returns (int96) {
       return _cfa.getNetFlow(_acceptedToken, address(this));
    }
    function getDaoTokenNetFlow() public view returns (int96) {
       return _cfa.getNetFlow(daoToken, address(this));
    }
    function _isSameToken(ISuperToken superToken) private view returns (bool) {
        return address(superToken) == address(_acceptedToken);
    }
    function _isCFAv1(address agreementClass) private view returns (bool) {
        return ISuperAgreement(agreementClass).agreementType()
            == keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1");
    }
    modifier onlyHost() {
        require(msg.sender == address(_host), "SuperApp: support only one host");
        _;
    }
    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isSameToken(superToken), "SuperApp: not accepted token");
        require(_isCFAv1(agreementClass), "SuperApp: only CFAv1 supported");
        _;
    }

    modifier onlyIfStreamsEnabled() {
        require(streamsEnabled, "SuperApp: streams disabled");
        _;
    }

    function tokensReceived(
        address,
        address,
        address,
        uint256,
        bytes calldata,
        bytes calldata
    ) external override {
        //require(msg.sender == address(daoToken), "Simple777Recipient: Invalid token");
        // do nothing
    }

}

contract DAOExecutor is TimelockControllerUpgradeable {
    constructor() initializer {}

    function initialize(uint256 minDelay, address[] memory proposers, address[] memory executors)
        initializer public
    {
        __TimelockController_init(minDelay, proposers, executors);
    }
}


contract DAOFactory {
    address immutable superAppImplementation;
    address immutable tokenImplementation;
    address immutable governorImplementation;
    address immutable timelockImplementation;
    address owner;

    ISuperTokenFactory private _superTokenFactory;

    constructor() public {
        _superTokenFactory = ISuperTokenFactory(0xd465e36e607d493cd4CC1e83bea275712BECd5E0); // Rinkeby
        superAppImplementation = address(new DAOSuperApp());
        tokenImplementation = address(new DAOToken());
        governorImplementation = address(new DAOGovernor());
        timelockImplementation = address(new DAOExecutor());
        owner = msg.sender;
    }

    event DAOSuperAppCreated(
        address indexed _owner,
        address superApp,
        address underlying,
        address superToken
    );

    function createDAOSuperApp(string memory name, string calldata symbol, bool enableDeposits, bool enableStreams) external returns (address) {
        console.log(block.timestamp);
        // step 1: create super token
        //INativeSuperToken daoToken = INativeSuperToken(address(new NativeSuperTokenProxy()));
        bytes32 salt = keccak256(abi.encodePacked(name, symbol));
        console.logBytes32(salt);
        //INativeSuperToken daoToken = INativeSuperToken(address(Create2.deploy(0, salt, type(NativeSuperTokenProxy).creationCode)));
        DAOToken daoToken = DAOToken(address(Clones.cloneDeterministic(tokenImplementation, salt)));
        console.log("daoToken", address(daoToken));
        // step 2: create Super wrapper:
        //ISuperToken superDaoToken = _superTokenFactory.createERC20Wrapper(daoToken, Upgradability.FULL_UPGRADABE, abi.encodePacked("Super ", name), abi.encodePacked(symbol, "x"));
        ISuperToken superDaoToken = _superTokenFactory.createERC20Wrapper(IERC20(address(daoToken)), uint8(18), ISuperTokenFactory.Upgradability.FULL_UPGRADABE, string(abi.encodePacked("Super ", name)), string(abi.encodePacked(symbol, "x")));
        // step 3: create super app
        address superApp = Clones.cloneDeterministic(superAppImplementation, salt);
        console.log("supr app", address(superApp));
        // step 4: initialize dao token
        daoToken.initialize(
            name,
            symbol,
            address(superApp)
        );
        console.log("after daoToken init");
        // step 4: initialize superApp
        address futureTimelock = Clones.predictDeterministicAddress(timelockImplementation, keccak256(abi.encodePacked(address(daoToken))), msg.sender);
        DAOSuperApp(superApp).initialize(address(daoToken), address(superDaoToken), msg.sender, futureTimelock, enableDeposits, enableStreams);
        console.log("after superApp init");
        emit DAOSuperAppCreated(msg.sender, address(superApp), address(daoToken), address(superDaoToken));
        return superApp;
    }

    event DAOGovernorCreated(
        address indexed _owner,
        address _contract,
        address _timelock
    );

    function createGoverance(address token, bool vetoable, uint256 votingPeriod) external returns(address) {
        //address timelock = new TimelockControllerUpgradeable();
        bytes32 salt = keccak256(abi.encodePacked(token));
        console.logBytes32(salt);
        //DAOExecutor timelock = DAOExecutor( payable(Create2.deploy(0, salt, type(DAOExecutor).creationCode)) );
        DAOExecutor timelock = DAOExecutor( payable(Clones.cloneDeterministic(timelockImplementation, salt)) );
        console.log("timelock", address(timelock));
        //DAOGovernor governor = new DAOGovernor();
        DAOGovernor governor = DAOGovernor( payable(Clones.cloneDeterministic(governorImplementation, salt)) );
        console.log("governor", address(governor));

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
