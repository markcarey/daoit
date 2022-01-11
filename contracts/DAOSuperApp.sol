// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.8.0;

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

import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

contract DAOSuperApp is IERC777RecipientUpgradeable, SuperAppBase, Initializable, AccessControlEnumerableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMath for uint256;

    ISuperfluid _host;
    IConstantFlowAgreementV1 _cfa;
    DAOToken public underlying;
    ISuperToken public daoToken;
    ISuperToken private _acceptedToken; // accepted streaming inflow token
    address weth;
    address router;
   
    mapping(address => int96) flowRates;

    bytes32 public constant MANAGER = keccak256("MANAGER_ROLE");
   
    address admin;
    address treasury;
    bool public depositsEnabled;
    bool public streamsEnabled;

    function initialize(
        address _underlying,
        address _daoToken,
        address owner,
        address _treasury,
        address accepted,
        address _weth,
        address host,
        address cfa,
        address swapRouter
    ) public virtual initializer
    {
        require(address(_daoToken) != address(0), "daoToken is zero address");
        __AccessControl_init_unchained();
        __AccessControlEnumerable_init_unchained();
        IERC1820RegistryUpgradeable _erc1820 = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        _erc1820.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));

        weth = _weth;
        _host = ISuperfluid(host);
        _cfa = IConstantFlowAgreementV1(cfa);
        router = swapRouter;

        uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;
        _host.registerAppByFactory(ISuperApp(address(this)), configWord);  //TODO: uncomment this!!!!

        daoToken = ISuperToken(_daoToken);
        underlying = DAOToken(_underlying);
        admin = owner;
        treasury = _treasury;

        // default to enabled, use functions to disable
        streamsEnabled = true;
        depositsEnabled = true;

        underlying.approve(address(daoToken), type(uint256).max);

        //Access Control
        _setupRole(DEFAULT_ADMIN_ROLE, treasury);
        _setupRole(MANAGER, admin);
        _setupRole(MANAGER, treasury);

        // super token accepted for streams
        _acceptedToken = ISuperToken(accepted);

    }

    function totalSupply() external view returns (uint256) {
        uint256 total = underlying.totalSupply();
        uint256 bal = daoToken.balanceOf(address(this));
        return total.sub(bal);
    }

    function acceptedToken() external view returns (address) {
        return address(_acceptedToken);
    }

    function treasuryBalance() external view returns (uint256) {
        uint256 sTotal = _acceptedToken.balanceOf(treasury);
        address tokenAddress = _acceptedToken.getUnderlyingToken();
        if ( tokenAddress == address(0) ) {
            tokenAddress = weth;
        }
        IERC20 token = IERC20(tokenAddress);
        uint256 uTotal = token.balanceOf(treasury);
        return sTotal.add(uTotal);
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
        currentReserves = daoToken.balanceOf(address(this));
        return currentReserves;
    }

    function sharePrice() external view returns (uint256) {
        uint256 supply = this.totalSupply();
        if ( supply == 0 ) return 100;
        uint256 treasuryBal = this.treasuryBalance();
        if ( treasuryBal == 0 ) return 100;
        return supply.mul(100).div(treasuryBal);
    }

    function want() public view returns(address) {
        address tokenAddress = _acceptedToken.getUnderlyingToken();
        if ( tokenAddress == address(0) ) {
            tokenAddress = weth;
        }
        return tokenAddress;
    }

    function deposit(address tokenAddress, uint _amount, address beneficiary) public nonReentrant {
        require(depositsEnabled, "Deposits Disabled");
        // chedck the treasury balance of preferred token before deposit
        uint256 _pool = this.treasuryBalance();
        IERC20 token = IERC20(tokenAddress);
        if ( tokenAddress == want() ) {
            // the token is our preferred token
            token.transferFrom(msg.sender, treasury, _amount);
        } else {
            // the token is *not* our preferred token
            // transfer it anyway and try to swap if for preferred
            token.transferFrom(msg.sender, address(this), _amount);
            token.approve(router, _amount);
            IUniswapV2Router02 uniswapRouter = IUniswapV2Router02(router);
            address[] memory path = new address[](2);
            path[0] = tokenAddress;
            path[1] = want();
            // try to swap on uniswap v2 (or Sushi, Quikswap, etc.)
            try uniswapRouter.swapExactTokensForTokens(_amount, 0, path, treasury, block.timestamp) {
                // it worked -- the treasurty balance of our preferred token has grown
            }
            catch {
                // swap failed
                // transfer the deposited token to treasury as is
                token.transferFrom(address(this), treasury, _amount);
            }
        }
        // treasury balance of preferred token after the deposit
        uint256 _after = this.treasuryBalance();
        _amount = _after.sub(_pool);
        if (_amount == 0) {
            // swap for preferred token failed
            // no shares issue because we can't calculate
            // DAO could later grant shares via a proposal
            return;
        }
        uint256 shares = 0;
        if ( ( this.totalSupply() == 0 ) || ( _pool == 0 ) ) {
            shares = _amount;
        } else {
            shares = (_amount.mul(this.totalSupply())).div(_pool);
        }
        if ( beneficiary == address(0) ) {
            beneficiary = msg.sender;
        }
        if (shares > 0) {
            underlying.mint(beneficiary, shares);
        }
    }

    // these functions can be used to move tokens / ETH to the treasury
    function withdrawToken(address _tokenContract) external {
        IERC20 tokenContract = IERC20(_tokenContract);
        tokenContract.transfer(treasury, tokenContract.balanceOf(address(this)) );
    }
    function withdrawETH() external payable {
        payable(treasury).transfer(address(this).balance);
    }

    function grant(address to, uint256 amount) external onlyRole(MANAGER) {
        // grants daoTokens to an address
        underlying.mint(to, amount);
    }

    function setDepositsEnabled(bool _depositsEnabled) external onlyRole(MANAGER) {
        depositsEnabled = _depositsEnabled;
    }
    function setStreamsEnabled(bool _streamsEnabled) external onlyRole(MANAGER) {
        streamsEnabled = _streamsEnabled;
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
      int96 newDaoTokenFlowRate = daoTokenFlowRate;
      if (multiplier != 0) {
          newDaoTokenFlowRate = int96(int256( uint256(uint96(inFlowRate)).mul(multiplier).div(100) ));
      }

      _updateReserves(newDaoTokenFlowRate);

      if ( (daoTokenFlowRate != int96(0)) && (inFlowRate != int96(0)) ){
        // @dev if there already exists an outflow, then update it.
        (newCtx, ) = _host.callAgreementWithContext(
            _cfa,
            abi.encodeWithSelector(
                _cfa.updateFlow.selector,
                daoToken,
                customer,
                newDaoTokenFlowRate,
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
                treasuryFlowRate + (inFlowRate - flowRates[customer]),
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
                  newDaoTokenFlowRate,
                  new bytes(0) // placeholder
              ),
              "0x",
              newCtx
          );
          
          if ( treasuryFlowRate == int96(0) ) {
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
          } else {
            // @dev update the treasury flow
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
          }
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
        // According to the app basic law, we should never revert in a termination callback
        if (!streamsEnabled) return _ctx;
        if (!_isSameToken(_superToken) || !_isCFAv1(_agreementClass)) return _ctx;
        if (msg.sender != address(_host)) return _ctx;
        (address customer,) = abi.decode(_agreementData, (address, address));
        (,int96 inFlowRate,,) = _cfa.getFlowByID(_superToken, _agreementId);
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

