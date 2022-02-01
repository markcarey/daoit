require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const appFactoryJSON = require("../artifacts/contracts/DAOit.sol/DAOFactory.json");
//const govFactoryJSON = require("../artifacts/contracts/DAOit.sol/DAOGovernanceFactory.json");
const superAppJSON = require("../artifacts/contracts/DAOSuperApp.sol/DAOSuperApp.json");

const appFactoryAddress = "0xA110e05133521C86E82fF5D1D482344A46CDBDF9";
//const govFactoryAddress = appFactoryAddress;

const superAppAddress = "0xeA857995adBe6160713DfC116d83FEDDa125D6A6";
const daoTokenAddress = "0x1140BDd4CaC1660E1bDa75af8113868E0E3B722E";
const superTokenAddress = "0x20374426b9c1f98110dd6E965feD264d6102b5c2";

const governorAddress = "0x973332DBCbbf08107B9eA499847884603A54Ef51";
const timelockAddress = "0xE4Ba755aB8da3bC521C489c140E3E4A1a4f0b3D3";

const govJSON = require("../artifacts/contracts/governance/Governor.sol/DAOGovernor.json");
const execJSON = require("../artifacts/contracts/DAOit.sol/DAOExecutor.json");
const appJSON = require("../artifacts/contracts/DAOSuperApp.sol/DAOSuperApp.json");

var addr = {};
var chain = "polygon";
if (chain == "mumbai") {
  //Mumbai:
  addr.router = "";
  addr.Resolver = "0x8C54C83FbDe3C59e59dd6E324531FB93d4F504d3";
  addr.SuperTokenFactory = "0x200657E2f123761662567A1744f9ACAe50dF47E6";
  addr.SuperHost = "0xEB796bdb90fFA0f28255275e16936D25d3418603";
  addr.cfa = "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873";
  addr.WETH = "0x3C68CE8504087f89c640D02d133646d98e64ddd9";
  addr.DAI = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F";
  addr.USDC = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e";
}
if (chain == "polygon") {
  //Polygon
  addr.Resolver = "0xE0cc76334405EE8b39213E620587d815967af39C";
  addr.SuperTokenFactory = "0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34";
  addr.SuperHost = "0x3E14dC1b13c488a8d5D310918780c983bD5982E7";
  addr.cfa = ""; // TODO: fill this in
  addr.WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";
  addr.DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
  addr.USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
  addr.ETHx = "0x27e1e4E6BC79D93032abef01025811B7E4727e85";
  addr.WETHx = addr.ETHx;
  addr.USDCx = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
  addr.WBTC = "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6";
  addr.WBTCx = "0x4086eBf75233e8492F1BCDa41C7f2A8288c2fB92";
  addr.DAIx = "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2";
}
if (chain == "kovan") {
  //Kovan
  addr.router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  addr.Resolver = "0x851d3dd9dc97c1df1DA73467449B3893fc76D85B";
  addr.SuperTokenFactory = "0xF5F666AC8F581bAef8dC36C7C8828303Bd4F8561";
  addr.SuperHost = "0xF0d7d1D47109bA426B9D8A3Cde1941327af1eea3";
  addr.cfa = "0xECa8056809e7e8db04A8fF6e4E82cD889a46FE2F";
  addr.WETH = "";
  addr.DAI = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
  addr.USDC = "";
  addr.ETHx = "";
  addr.WETHx = addr.ETHx;
  addr.USDCx = "";
  addr.WBTC = "";
  addr.WBTCx = "";
  addr.DAIx = "0x900B1D89FeC799D4D47b5dB345d6a460eb2530E8";
}
if ( chain == "rinkeby" ) {
  addr.router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  addr.Resolver = "0x659635Fab0A0cef1293f7eb3c7934542B6A6B31A";
  addr.SuperTokenFactory = "0xd465e36e607d493cd4CC1e83bea275712BECd5E0";
  addr.SuperHost = "0xeD5B5b32110c3Ded02a07c8b8e97513FAfb883B6";
  addr.cfa = "0xF4C5310E51F6079F601a5fb7120bC72a70b96e2A";
  addr.WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
  addr.DAI = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
  addr.USDC = "";
  addr.ETHx = "0xa623b2DD931C5162b7a0B25852f4024Db48bb1A0";
  addr.WETHx = addr.ETHx; // "0x3FbcaeaA76d6f7Fe31DaEa1655b97F1436c0a747";
  addr.USDCx = "";
  addr.WBTC = "";
  addr.WBTCx = "";
  addr.DAIx = "";
  addr.fDAI = "0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7";
  addr.fDAIx = "0x745861AeD1EEe363b4AaA5F1994Be40b1e05Ff90";
}

const c2factoryAddress = '0x4a27c059FD7E383854Ea7DE6Be9c390a795f6eE3';
const c2factoryAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'salt',
        type: 'uint256',
      },
    ],
    name: 'Deployed',
    type: 'event',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes',
        name: 'code',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'salt',
        type: 'uint256',
      },
    ],
    name: 'deploy',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];


const MANAGER = web3.utils.keccak256("MANAGER_ROLE");

const resolverABI = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "bytes32",
    "name": "previousAdminRole",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "bytes32",
    "name": "newAdminRole",
    "type": "bytes32"
  }],
  "name": "RoleAdminChanged",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "sender",
    "type": "address"
  }],
  "name": "RoleGranted",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "sender",
    "type": "address"
  }],
  "name": "RoleRevoked",
  "type": "event"
}, {
  "inputs": [],
  "name": "DEFAULT_ADMIN_ROLE",
  "outputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "name",
    "type": "string"
  }],
  "name": "get",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }],
  "name": "getRoleAdmin",
  "outputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "index",
    "type": "uint256"
  }],
  "name": "getRoleMember",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }],
  "name": "getRoleMemberCount",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "grantRole",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "hasRole",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "renounceRole",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "role",
    "type": "bytes32"
  }, {
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "revokeRole",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "string",
    "name": "name",
    "type": "string"
  }, {
    "internalType": "address",
    "name": "target",
    "type": "address"
  }],
  "name": "set",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];

const superTokenFactoryABI = [{
  "inputs": [{
    "internalType": "contract ISuperfluid",
    "name": "host",
    "type": "address"
  }, {
    "internalType": "contract SuperTokenFactoryHelper",
    "name": "helper",
    "type": "address"
  }],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "bytes32",
    "name": "uuid",
    "type": "bytes32"
  }, {
    "indexed": false,
    "internalType": "address",
    "name": "codeAddress",
    "type": "address"
  }],
  "name": "CodeUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "contract ISuperToken",
    "name": "token",
    "type": "address"
  }],
  "name": "CustomSuperTokenCreated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "contract ISuperToken",
    "name": "token",
    "type": "address"
  }],
  "name": "SuperTokenCreated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "contract ISuperToken",
    "name": "tokenLogic",
    "type": "address"
  }],
  "name": "SuperTokenLogicCreated",
  "type": "event"
}, {
  "inputs": [{
    "internalType": "contract ERC20WithTokenInfo",
    "name": "underlyingToken",
    "type": "address"
  }, {
    "internalType": "enum ISuperTokenFactory.Upgradability",
    "name": "upgradability",
    "type": "uint8"
  }, {
    "internalType": "string",
    "name": "name",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "symbol",
    "type": "string"
  }],
  "name": "createERC20Wrapper",
  "outputs": [{
    "internalType": "contract ISuperToken",
    "name": "superToken",
    "type": "address"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "contract IERC20",
    "name": "underlyingToken",
    "type": "address"
  }, {
    "internalType": "uint8",
    "name": "underlyingDecimals",
    "type": "uint8"
  }, {
    "internalType": "enum ISuperTokenFactory.Upgradability",
    "name": "upgradability",
    "type": "uint8"
  }, {
    "internalType": "string",
    "name": "name",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "symbol",
    "type": "string"
  }],
  "name": "createERC20Wrapper",
  "outputs": [{
    "internalType": "contract ISuperToken",
    "name": "superToken",
    "type": "address"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "contract ISuperfluid",
    "name": "host",
    "type": "address"
  }],
  "name": "createSuperTokenLogic",
  "outputs": [{
    "internalType": "address",
    "name": "logic",
    "type": "address"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "getCodeAddress",
  "outputs": [{
    "internalType": "address",
    "name": "codeAddress",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getHost",
  "outputs": [{
    "internalType": "address",
    "name": "host",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getSuperTokenLogic",
  "outputs": [{
    "internalType": "contract ISuperToken",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "initialize",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "customSuperTokenProxy",
    "type": "address"
  }],
  "name": "initializeCustomSuperToken",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "newAddress",
    "type": "address"
  }],
  "name": "updateCode",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];


var ERC20abi = [
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_spender",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_from",
              "type": "address"
          },
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "name": "",
              "type": "uint8"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "name": "balance",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "name": "",
              "type": "string"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "constant": false,
      "inputs": [
          {
              "name": "_to",
              "type": "address"
          },
          {
              "name": "_value",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "name": "",
              "type": "bool"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "constant": true,
      "inputs": [
          {
              "name": "_owner",
              "type": "address"
          },
          {
              "name": "_spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
  },
  {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  }
];

var WETHabi = [{
  "inputs": [{
    "internalType": "string",
    "name": "name",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "symbol",
    "type": "string"
  }, {
    "internalType": "uint8",
    "name": "decimals",
    "type": "uint8"
  }],
  "stateMutability": "nonpayable",
  "type": "constructor"
  }, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "owner",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
  }, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
  }, {
  "inputs": [{
    "internalType": "address",
    "name": "owner",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "internalType": "uint8",
    "name": "",
    "type": "uint8"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "subtractedValue",
    "type": "uint256"
  }],
  "name": "decreaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "addedValue",
    "type": "uint256"
  }],
  "name": "increaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "mint",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
  }, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "sender",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}
];

var superABI = [{
  "inputs": [{
    "internalType": "contract ISuperfluid",
    "name": "host",
    "type": "address"
  }],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "state",
    "type": "bytes"
  }],
  "name": "AgreementAccountStateUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": false,
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "AgreementCreated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "penaltyAccount",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "rewardAccount",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "rewardAmount",
    "type": "uint256"
  }],
  "name": "AgreementLiquidated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "address",
    "name": "liquidatorAccount",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "penaltyAccount",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "bondAccount",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "rewardAmount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "bailoutAmount",
    "type": "uint256"
  }],
  "name": "AgreementLiquidatedBy",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "slotId",
    "type": "uint256"
  }],
  "name": "AgreementStateUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }],
  "name": "AgreementTerminated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "indexed": false,
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "AgreementUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "owner",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Approval",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenHolder",
    "type": "address"
  }],
  "name": "AuthorizedOperator",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "bailoutAccount",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "bailoutAmount",
    "type": "uint256"
  }],
  "name": "Bailout",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "Burned",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "bytes32",
    "name": "uuid",
    "type": "bytes32"
  }, {
    "indexed": false,
    "internalType": "address",
    "name": "codeAddress",
    "type": "address"
  }],
  "name": "CodeUpdated",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "Minted",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "tokenHolder",
    "type": "address"
  }],
  "name": "RevokedOperator",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "indexed": false,
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "Sent",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "TokenDowngraded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "TokenUpgraded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": true,
    "internalType": "address",
    "name": "from",
    "type": "address"
  }, {
    "indexed": true,
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }],
  "name": "allowance",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "approve",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }],
  "name": "authorizeOperator",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "balanceOf",
  "outputs": [{
    "internalType": "uint256",
    "name": "balance",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "burn",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "createAgreement",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "decimals",
  "outputs": [{
    "internalType": "uint8",
    "name": "",
    "type": "uint8"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "subtractedValue",
    "type": "uint256"
  }],
  "name": "decreaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "defaultOperators",
  "outputs": [{
    "internalType": "address[]",
    "name": "",
    "type": "address[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "downgrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "getAccountActiveAgreements",
  "outputs": [{
    "internalType": "contract ISuperAgreement[]",
    "name": "",
    "type": "address[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "dataLength",
    "type": "uint256"
  }],
  "name": "getAgreementData",
  "outputs": [{
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "agreementClass",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "slotId",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "dataLength",
    "type": "uint256"
  }],
  "name": "getAgreementStateSlot",
  "outputs": [{
    "internalType": "bytes32[]",
    "name": "slotData",
    "type": "bytes32[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getCodeAddress",
  "outputs": [{
    "internalType": "address",
    "name": "codeAddress",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getHost",
  "outputs": [{
    "internalType": "address",
    "name": "host",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "getUnderlyingToken",
  "outputs": [{
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "granularity",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "addedValue",
    "type": "uint256"
  }],
  "name": "increaseAllowance",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "contract IERC20",
    "name": "underlyingToken",
    "type": "address"
  }, {
    "internalType": "uint8",
    "name": "underlyingDecimals",
    "type": "uint8"
  }, {
    "internalType": "string",
    "name": "n",
    "type": "string"
  }, {
    "internalType": "string",
    "name": "s",
    "type": "string"
  }],
  "name": "initialize",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "name": "isAccountCritical",
  "outputs": [{
    "internalType": "bool",
    "name": "isCritical",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "isAccountCriticalNow",
  "outputs": [{
    "internalType": "bool",
    "name": "isCritical",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "name": "isAccountSolvent",
  "outputs": [{
    "internalType": "bool",
    "name": "isSolvent",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "isAccountSolventNow",
  "outputs": [{
    "internalType": "bool",
    "name": "isSolvent",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "tokenHolder",
    "type": "address"
  }],
  "name": "isOperatorFor",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "address",
    "name": "liquidator",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "penaltyAccount",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "rewardAmount",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "bailoutAmount",
    "type": "uint256"
  }],
  "name": "makeLiquidationPayouts",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "name",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationApprove",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationDowngrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "spender",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationTransferFrom",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "operationUpgrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "operatorBurn",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "sender",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }, {
    "internalType": "bytes",
    "name": "operatorData",
    "type": "bytes"
  }],
  "name": "operatorSend",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{
    "internalType": "bytes32",
    "name": "",
    "type": "bytes32"
  }],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "name": "realtimeBalanceOf",
  "outputs": [{
    "internalType": "int256",
    "name": "availableBalance",
    "type": "int256"
  }, {
    "internalType": "uint256",
    "name": "deposit",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "owedDeposit",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }],
  "name": "realtimeBalanceOfNow",
  "outputs": [{
    "internalType": "int256",
    "name": "availableBalance",
    "type": "int256"
  }, {
    "internalType": "uint256",
    "name": "deposit",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "owedDeposit",
    "type": "uint256"
  }, {
    "internalType": "uint256",
    "name": "timestamp",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "operator",
    "type": "address"
  }],
  "name": "revokeOperator",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "userData",
    "type": "bytes"
  }],
  "name": "selfBurn",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "userData",
    "type": "bytes"
  }],
  "name": "selfMint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "send",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "int256",
    "name": "delta",
    "type": "int256"
  }],
  "name": "settleBalance",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "symbol",
  "outputs": [{
    "internalType": "string",
    "name": "",
    "type": "string"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "uint256",
    "name": "dataLength",
    "type": "uint256"
  }],
  "name": "terminateAgreement",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "totalSupply",
  "outputs": [{
    "internalType": "uint256",
    "name": "",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transfer",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }],
  "name": "transferAll",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "holder",
    "type": "address"
  }, {
    "internalType": "address",
    "name": "recipient",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "transferFrom",
  "outputs": [{
    "internalType": "bool",
    "name": "",
    "type": "bool"
  }],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "bytes32",
    "name": "id",
    "type": "bytes32"
  }, {
    "internalType": "bytes32[]",
    "name": "data",
    "type": "bytes32[]"
  }],
  "name": "updateAgreementData",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "account",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "slotId",
    "type": "uint256"
  }, {
    "internalType": "bytes32[]",
    "name": "slotData",
    "type": "bytes32[]"
  }],
  "name": "updateAgreementStateSlot",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "newAddress",
    "type": "address"
  }],
  "name": "updateCode",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "upgrade",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }],
  "name": "upgradeTo",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}];

const cfaABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "totalSenderFlowRate",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "totalReceiverFlowRate",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "userData",
        "type": "bytes"
      }
    ],
    "name": "FlowUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "agreementType",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "internalType": "bytes",
        "name": "ctx",
        "type": "bytes"
      }
    ],
    "name": "createFlow",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "newCtx",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "ctx",
        "type": "bytes"
      }
    ],
    "name": "deleteFlow",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "newCtx",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getAccountFlowInfo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "internalType": "uint256",
        "name": "deposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "owedDeposit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      }
    ],
    "name": "getDepositRequiredForFlowRate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "deposit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "getFlow",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "internalType": "uint256",
        "name": "deposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "owedDeposit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "agreementId",
        "type": "bytes32"
      }
    ],
    "name": "getFlowByID",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "internalType": "uint256",
        "name": "deposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "owedDeposit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deposit",
        "type": "uint256"
      }
    ],
    "name": "getMaximumFlowRateFromDeposit",
    "outputs": [
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getNetFlow",
    "outputs": [
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "realtimeBalanceOf",
    "outputs": [
      {
        "internalType": "int256",
        "name": "dynamicBalance",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "deposit",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "owedDeposit",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract ISuperfluidToken",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "int96",
        "name": "flowRate",
        "type": "int96"
      },
      {
        "internalType": "bytes",
        "name": "ctx",
        "type": "bytes"
      }
    ],
    "name": "updateFlow",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "newCtx",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const DAIabi = [{"inputs":[{"internalType":"uint256","name":"_initialAmount","type":"uint256"},{"internalType":"string","name":"_tokenName","type":"string"},{"internalType":"uint8","name":"_decimalUnits","type":"uint8"},{"internalType":"string","name":"_tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"allocateTo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const hostABI = [{"inputs":[{"internalType":"bool","name":"nonUpgradable","type":"bool"},{"internalType":"bool","name":"appWhiteListingEnabled","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"agreementType","type":"bytes32"},{"indexed":false,"internalType":"address","name":"code","type":"address"}],"name":"AgreementClassRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"agreementType","type":"bytes32"},{"indexed":false,"internalType":"address","name":"code","type":"address"}],"name":"AgreementClassUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperApp","name":"app","type":"address"}],"name":"AppRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"uuid","type":"bytes32"},{"indexed":false,"internalType":"address","name":"codeAddress","type":"address"}],"name":"CodeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ISuperfluidGovernance","name":"oldGov","type":"address"},{"indexed":false,"internalType":"contract ISuperfluidGovernance","name":"newGov","type":"address"}],"name":"GovernanceReplaced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperApp","name":"app","type":"address"},{"indexed":false,"internalType":"uint256","name":"reason","type":"uint256"}],"name":"Jail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract ISuperTokenFactory","name":"newFactory","type":"address"}],"name":"SuperTokenFactoryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperToken","name":"token","type":"address"},{"indexed":false,"internalType":"address","name":"code","type":"address"}],"name":"SuperTokenLogicUpdated","type":"event"},{"inputs":[],"name":"APP_WHITE_LISTING_ENABLED","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"CALLBACK_GAS_LIMIT","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_APP_LEVEL","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NON_UPGRADABLE_DEPLOYMENT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"bitmap","type":"uint256"},{"internalType":"bytes32","name":"agreementType","type":"bytes32"}],"name":"addToAgreementClassesBitmap","outputs":[{"internalType":"uint256","name":"newBitmap","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"targetApp","type":"address"}],"name":"allowCompositeApp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"ctx","type":"bytes"},{"internalType":"int256","name":"appAllowanceUsedDelta","type":"int256"}],"name":"appCallbackPop","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"ctx","type":"bytes"},{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"uint256","name":"appAllowanceGranted","type":"uint256"},{"internalType":"int256","name":"appAllowanceUsed","type":"int256"},{"internalType":"contract ISuperfluidToken","name":"appAllowanceToken","type":"address"}],"name":"appCallbackPush","outputs":[{"internalType":"bytes","name":"appCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"operationType","type":"uint32"},{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct ISuperfluid.Operation[]","name":"operations","type":"tuple[]"}],"name":"batchCall","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperAgreement","name":"agreementClass","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"callAgreement","outputs":[{"internalType":"bytes","name":"returnedData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperAgreement","name":"agreementClass","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bytes","name":"userData","type":"bytes"},{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"callAgreementWithContext","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"},{"internalType":"bytes","name":"returnedData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"name":"callAppAction","outputs":[{"internalType":"bytes","name":"returnedData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"callAppActionWithContext","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bool","name":"isTermination","type":"bool"},{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"callAppAfterCallback","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"},{"internalType":"bool","name":"isTermination","type":"bool"},{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"callAppBeforeCallback","outputs":[{"internalType":"bytes","name":"cbdata","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"ctx","type":"bytes"},{"internalType":"uint256","name":"appAllowanceWantedMore","type":"uint256"},{"internalType":"int256","name":"appAllowanceUsedDelta","type":"int256"}],"name":"ctxUseAllowance","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"decodeCtx","outputs":[{"components":[{"internalType":"uint8","name":"appLevel","type":"uint8"},{"internalType":"uint8","name":"callType","type":"uint8"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"msgSender","type":"address"},{"internalType":"bytes4","name":"agreementSelector","type":"bytes4"},{"internalType":"bytes","name":"userData","type":"bytes"},{"internalType":"uint256","name":"appAllowanceGranted","type":"uint256"},{"internalType":"uint256","name":"appAllowanceWanted","type":"uint256"},{"internalType":"int256","name":"appAllowanceUsed","type":"int256"},{"internalType":"address","name":"appAddress","type":"address"},{"internalType":"contract ISuperfluidToken","name":"appAllowanceToken","type":"address"}],"internalType":"struct ISuperfluid.Context","name":"context","type":"tuple"}],"stateMutability":"pure","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"operationType","type":"uint32"},{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct ISuperfluid.Operation[]","name":"operations","type":"tuple[]"}],"name":"forwardBatchCall","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"agreementType","type":"bytes32"}],"name":"getAgreementClass","outputs":[{"internalType":"contract ISuperAgreement","name":"agreementClass","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"appAddr","type":"address"}],"name":"getAppLevel","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"}],"name":"getAppManifest","outputs":[{"internalType":"bool","name":"isSuperApp","type":"bool"},{"internalType":"bool","name":"isJailed","type":"bool"},{"internalType":"uint256","name":"noopMask","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCodeAddress","outputs":[{"internalType":"address","name":"codeAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGovernance","outputs":[{"internalType":"contract ISuperfluidGovernance","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSuperTokenFactory","outputs":[{"internalType":"contract ISuperTokenFactory","name":"factory","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSuperTokenFactoryLogic","outputs":[{"internalType":"address","name":"logic","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperfluidGovernance","name":"gov","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperAgreement","name":"agreementClass","type":"address"}],"name":"isAgreementClassListed","outputs":[{"internalType":"bool","name":"yes","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"agreementType","type":"bytes32"}],"name":"isAgreementTypeListed","outputs":[{"internalType":"bool","name":"yes","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"}],"name":"isApp","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"}],"name":"isAppJailed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"contract ISuperApp","name":"targetApp","type":"address"}],"name":"isCompositeAppAllowed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"ctx","type":"bytes"}],"name":"isCtxValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"forwarder","type":"address"}],"name":"isTrustedForwarder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"ctx","type":"bytes"},{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"uint256","name":"reason","type":"uint256"}],"name":"jailApp","outputs":[{"internalType":"bytes","name":"newCtx","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bitmap","type":"uint256"}],"name":"mapAgreementClasses","outputs":[{"internalType":"contract ISuperAgreement[]","name":"agreementClasses","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"contract ISuperAgreement","name":"agreementClassLogic","type":"address"}],"name":"registerAgreementClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"configWord","type":"uint256"}],"name":"registerApp","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperApp","name":"app","type":"address"},{"internalType":"uint256","name":"configWord","type":"uint256"}],"name":"registerAppByFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"configWord","type":"uint256"},{"internalType":"string","name":"registrationKey","type":"string"}],"name":"registerAppWithKey","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"bitmap","type":"uint256"},{"internalType":"bytes32","name":"agreementType","type":"bytes32"}],"name":"removeFromAgreementClassesBitmap","outputs":[{"internalType":"uint256","name":"newBitmap","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperfluidGovernance","name":"newGov","type":"address"}],"name":"replaceGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperAgreement","name":"agreementClassLogic","type":"address"}],"name":"updateAgreementClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"updateCode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperTokenFactory","name":"newFactory","type":"address"}],"name":"updateSuperTokenFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperToken","name":"token","type":"address"}],"name":"updateSuperTokenLogic","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"versionRecipient","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}];

const lockABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"sendTo","type":"address"},{"indexed":false,"internalType":"uint256","name":"refund","type":"uint256"}],"name":"CancelKey","type":"event"},{"anonymous":false,"inputs":[],"name":"Disable","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"_timeAdded","type":"bool"}],"name":"ExpirationChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ExpireKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"KeyGranterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"KeyGranterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"_newManager","type":"address"}],"name":"KeyManagerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"LockManagerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"LockManagerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"symbol","type":"string"}],"name":"NewLockSymbol","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"keyManager","type":"address"},{"indexed":false,"internalType":"uint256","name":"nextAvailableNonce","type":"uint256"}],"name":"NonceChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldKeyPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"keyPrice","type":"uint256"},{"indexed":false,"internalType":"address","name":"oldTokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"}],"name":"PricingChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"freeTrialLength","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"refundPenaltyBasisPoints","type":"uint256"}],"name":"RefundPenaltyChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"newExpiration","type":"uint256"}],"name":"RenewKeyPurchase","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"transferFeeBasisPoints","type":"uint256"}],"name":"TransferFeeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":true,"internalType":"address","name":"beneficiary","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawal","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addKeyGranter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addLockManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_approved","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_spender","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"approveBeneficiary","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_keyOwner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"beneficiary","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"cancelAndRefund","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_keyManager","type":"address"},{"internalType":"uint8","name":"_v","type":"uint8"},{"internalType":"bytes32","name":"_r","type":"bytes32"},{"internalType":"bytes32","name":"_s","type":"bytes32"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"cancelAndRefundFor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"disableLock","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"expirationDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_keyOwner","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"expireAndRefundFor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"freeTrialLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"address","name":"_account","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_keyManager","type":"address"},{"internalType":"address","name":"_txSender","type":"address"}],"name":"getCancelAndRefundApprovalHash","outputs":[{"internalType":"bytes32","name":"approvalHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_keyOwner","type":"address"}],"name":"getCancelAndRefundValueFor","outputs":[{"internalType":"uint256","name":"refund","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_keyOwner","type":"address"}],"name":"getHasValidKey","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_page","type":"uint256"},{"internalType":"uint256","name":"_pageSize","type":"uint256"}],"name":"getOwnersByPage","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_account","type":"address"}],"name":"getTokenIdFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_keyOwner","type":"address"},{"internalType":"uint256","name":"_time","type":"uint256"}],"name":"getTransferFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"_recipients","type":"address[]"},{"internalType":"uint256[]","name":"_expirationTimestamps","type":"uint256[]"},{"internalType":"address[]","name":"_keyManagers","type":"address[]"}],"name":"grantKeys","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_lockCreator","type":"address"},{"internalType":"uint256","name":"_expirationDuration","type":"uint256"},{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_keyPrice","type":"uint256"},{"internalType":"uint256","name":"_maxNumberOfKeys","type":"uint256"},{"internalType":"string","name":"_lockName","type":"string"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_nextAvailableNonce","type":"uint256"}],"name":"invalidateOffchainApproval","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"isAlive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isKeyGranter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"address","name":"_keyOwner","type":"address"}],"name":"isKeyOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isLockManager","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_keyOwner","type":"address"}],"name":"keyExpirationTimestampFor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"keyManagerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"keyManagerToNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"keyPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxNumberOfKeys","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfOwners","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"onKeyCancelHook","outputs":[{"internalType":"contract ILockKeyCancelHook","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"onKeyPurchaseHook","outputs":[{"internalType":"contract ILockKeyPurchaseHook","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"owners","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"publicLockVersion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"address","name":"_referrer","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"purchase","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"address","name":"_referrer","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"purchasePriceFor","outputs":[{"internalType":"uint256","name":"minKeyPrice","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"refundPenaltyBasisPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceLockManager","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_granter","type":"address"}],"name":"revokeKeyGranter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_baseTokenURI","type":"string"}],"name":"setBaseTokenURI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_onKeyPurchaseHook","type":"address"},{"internalType":"address","name":"_onKeyCancelHook","type":"address"}],"name":"setEventHooks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"address","name":"_keyManager","type":"address"}],"name":"setKeyManagerOf","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_timeShared","type":"uint256"}],"name":"shareKey","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"_keyOwner","type":"address"},{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"transferFeeBasisPoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_recipient","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"unlockProtocol","outputs":[{"internalType":"contract IUnlock","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_beneficiary","type":"address"}],"name":"updateBeneficiary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_keyPrice","type":"uint256"},{"internalType":"address","name":"_tokenAddress","type":"address"}],"name":"updateKeyPricing","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_lockName","type":"string"}],"name":"updateLockName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_lockSymbol","type":"string"}],"name":"updateLockSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_freeTrialLength","type":"uint256"},{"internalType":"uint256","name":"_refundPenaltyBasisPoints","type":"uint256"}],"name":"updateRefundPenalty","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_transferFeeBasisPoints","type":"uint256"}],"name":"updateTransferFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];

const sfGovABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperfluid","name":"host","type":"address"},{"indexed":true,"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"indexed":false,"internalType":"bool","name":"set","type":"bool"},{"indexed":false,"internalType":"uint256","name":"liquidationPeriod","type":"uint256"}],"name":"CFAv1LiquidationPeriodChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"uuid","type":"bytes32"},{"indexed":false,"internalType":"address","name":"codeAddress","type":"address"}],"name":"CodeUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperfluid","name":"host","type":"address"},{"indexed":true,"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"indexed":false,"internalType":"bytes32","name":"key","type":"bytes32"},{"indexed":false,"internalType":"bool","name":"set","type":"bool"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"ConfigChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperfluid","name":"host","type":"address"},{"indexed":true,"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"indexed":false,"internalType":"bool","name":"set","type":"bool"},{"indexed":false,"internalType":"address","name":"rewardAddress","type":"address"}],"name":"RewardAddressChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"contract ISuperfluid","name":"host","type":"address"},{"indexed":true,"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"indexed":false,"internalType":"bool","name":"set","type":"bool"},{"indexed":false,"internalType":"address","name":"forwarder","type":"address"},{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"TrustedForwarderChanged","type":"event"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"address","name":"factory","type":"address"}],"name":"authorizeAppFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"}],"name":"clearCFAv1LiquidationPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"}],"name":"clearRewardAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"address","name":"forwarder","type":"address"}],"name":"clearTrustedForwarder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"address","name":"forwarder","type":"address"}],"name":"disableTrustedForwarder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"address","name":"forwarder","type":"address"}],"name":"enableTrustedForwarder","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"}],"name":"getCFAv1LiquidationPeriod","outputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCodeAddress","outputs":[{"internalType":"address","name":"codeAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getConfigAsAddress","outputs":[{"internalType":"address","name":"value","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"getConfigAsUint256","outputs":[{"internalType":"uint256","name":"period","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"}],"name":"getRewardAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"address","name":"factory","type":"address"}],"name":"isAuthorizedAppFactory","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"address","name":"forwarder","type":"address"}],"name":"isTrustedForwarder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"address","name":"agreementClass","type":"address"}],"name":"registerAgreementClass","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"address","name":"newGov","type":"address"}],"name":"replaceGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"setCFAv1LiquidationPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperfluidToken","name":"superToken","type":"address"},{"internalType":"address","name":"rewardAddress","type":"address"}],"name":"setRewardAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"address","name":"factory","type":"address"}],"name":"unauthorizeAppFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAddress","type":"address"}],"name":"updateCode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"address","name":"hostNewLogic","type":"address"},{"internalType":"address[]","name":"agreementClassNewLogics","type":"address[]"},{"internalType":"address","name":"superTokenFactoryNewLogic","type":"address"}],"name":"updateContracts","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"contract ISuperToken","name":"token","type":"address"}],"name":"updateSuperTokenLogic","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract ISuperfluid","name":"host","type":"address"},{"internalType":"bytes32","name":"key","type":"bytes32"}],"name":"whiteListNewApp","outputs":[],"stateMutability":"nonpayable","type":"function"}];

const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);
let daoFactory = new ethers.Contract(
  appFactoryAddress,
  appFactoryJSON.abi,
  signer
);
//let govFactory = new ethers.Contract(
//  govFactoryAddress,
//  govFactoryJSON.abi,
//  signer
//);

let host = new ethers.Contract(
  addr.SuperHost,
  hostABI,
  signer
);
let CFAv1 = new ethers.Contract(
  addr.cfa,
  cfaABI,
  signer
);

let gov = new ethers.Contract(
  governorAddress,
  govJSON.abi,
  signer
);
let app = new ethers.Contract(
  superAppAddress,
  appJSON.abi,
  signer
);


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queue() {
  const fromTally = "0x6370920e000000000000000000000000d89311d9613b6b3fc45e2ba64e4d8b5161dc4c580000000000000000000000000000000000000000000000000000b5e620f48000";
  const targets = ["0xeA857995adBe6160713DfC116d83FEDDa125D6A6"];
  const values = [0];
  var cdata = app.interface.encodeFunctionData("grant", [PUBLIC_KEY, "20000000000000000000"]);
  console.log("cdata", cdata);
  const calldatas = [fromTally];
  var descString = "Grant tokens js proposal";
  //descString = "Grant me even more tokens grant more tokens to Mark";
  const descBytes = ethers.utils.id(descString);
  
  //await gov.propose(
  //  targets,
  //  values,
  //  [cdata],
  //  descString
  //);
  var id = await gov.hashProposal(
    targets,
    values,
    [cdata],
    descBytes
  );
  var state = await gov.state(id);
  console.log("state", state);
  //var q = await gov.queue(
  //  targets,
  //  values,
  //  [cdata],
  //  descBytes
  //);
  var e = await gov.execute(
    targets,
    values,
    [cdata],
    descBytes
  );
  console.log(id);
}

async function openStream(sToken, flowRateBySeconds) {
  let iface = new ethers.utils.Interface(cfaABI);
  await host.callAgreement(
    addr.cfa,
    iface.encodeFunctionData("createFlow", [
        sToken,
        superAppAddress,
        flowRateBySeconds,
        "0x"
    ]),
    "0x"
  );
}

async function updateStream(sToken, flowRateBySeconds) {
  let iface = new ethers.utils.Interface(cfaABI);
  await host.callAgreement(
    addr.cfa,
    iface.encodeFunctionData("updateFlow", [
        sToken,
        superAppAddress,
        flowRateBySeconds,
        "0x"
    ]),
    "0x"
  );
}

async function upgrade() {
  let superToken = new ethers.Contract(
    addr.fDAIx,
    superABI,
    signer
  );
  let underlying = new ethers.Contract(
    addr.fDAI,
    ERC20abi,
    signer
  );
  await underlying.approve(addr.fDAIx, '1000000000000000000000000');
  await superToken.upgrade('10000000000000000000000');
}

 async function createApp(name, symbol, accepted) {
  await daoFactory.createDAOSuperApp(name, symbol, accepted, addr.WETH, addr.SuperHost, addr.cfa, addr.router);
  var filter = await daoFactory.filters.DAOSuperAppCreated();
  daoFactory.on(filter, (owner, app, underlying, sToken, event) => { 
      console.log("superApp created at " + app);
      console.log("token created at " + underlying);
      console.log("sToken created at " + sToken);
  });
  await sleep(15000);
}

async function createGov(token, vetoable, votingPeriod) {
  await daoFactory.createGoverance(token, vetoable, votingPeriod);
  var filter = await daoFactory.filters.DAOGovernorCreated();
  daoFactory.on(filter, (owner, governor, timelock, event) => { 
      console.log("governor created at " + governor);
      console.log("timelock created at " + timelock);
  });
  await sleep(15000);
}

async function approve(token, operator, amt) {
  let contract = new ethers.Contract(
    token,
    ERC20abi,
    signer
  );
  await contract.approve(operator, amt);
  console.log("approved");
}

async function mintDAI(amt) {
  let contract = new ethers.Contract(
    addr.DAI,
    DAIabi,
    signer
  );
  await contract.allocateTo(PUBLIC_KEY, amt);
  console.log("minted DAI");
}

async function deposit(token, amt, beneficiary) {
  let contract = new ethers.Contract(
    superAppAddress,
    superAppJSON.abi,
    signer
  );
  await contract.deposit(token, amt, beneficiary);
  console.log("deposited");
}

async function grant(beneficiary, amt) {
  let contract = new ethers.Contract(
    superAppAddress,
    superAppJSON.abi,
    signer
  );
  await contract.grant(beneficiary, amt);
  console.log("granted");
}



async function getSome(token, eoa) {
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [eoa],
  });
  const signer = await ethers.getSigner(eoa);
  let contract = new ethers.Contract(
    token,
    ERC20abi,
    signer
  );
  var bal = contract.balanceOf(eoa);
  await contract.transfer(PUBLIC_KEY, bal).then((transferResult) => {
    console.log(transferResult);
  });
  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [eoa],
  });
}

async function authFactory(app) {
  const owner = "0x1EB3FAA360bF1f093F5A18d21f21f13D769d044A";
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [owner],
  });
  const signer = await ethers.getSigner(owner);
  let contract = new ethers.Contract(
    "0x3AD3f7A0965Ce6f9358AD5CCE86Bc2b05F1EE087",
    sfGovABI,
    signer
  );
  await (await contract.authorizeAppFactory("0x3E14dC1b13c488a8d5D310918780c983bD5982E7", "0x30DA70572B65762Aeb78D87F5BD34FdcD701B02C")).wait();
  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [owner],
  });
  var isAuthed = await contract.isAuthorizedAppFactory("0x3E14dC1b13c488a8d5D310918780c983bD5982E7", "0x30DA70572B65762Aeb78D87F5BD34FdcD701B02C");
  console.log("Factory authorized:" + isAuthed);
}

async function setNonce() {
  await hre.network.provider.send("hardhat_setNonce", [
    PUBLIC_KEY,
    "0x3C",
  ]);
}

async function deployAppFactory() {
  const c2factory = new ethers.Contract(c2factoryAddress, c2factoryAbi, signer);
  const salt = ethers.utils.id("VERSION0");
  const result = await c2factory.deploy(appFactoryJSON.bytecode, salt);
  var filter = await c2factory.filters.Deployed();
  c2factory.on(filter, (address, salt, event) => { 
      console.log("app factory created at " + address);
  });
  await sleep(15000);
}

//queue()
//deployAppFactory()
//createApp("The App28", "APP28", addr.WETHx)
//createGov(daoTokenAddress, true, 30)
 //setNonce()
//openStream(addr.fDAIx, "1693766937669") 
//openStream(addr.WETHx, "1693766937669") 
//updateStream(addr.fDAIx, "2693766937669") 
//updateStream(addr.WETHx, "2693766937669") 
//getSome(addr.DAI, "0xba78afc7f22940896b9478567eaf5791f56a5774")
//getSome(addr.fDAI, "0x5a9e792143bf2708b4765c144451dca54f559a19")
//getSome(addr.fDAIx, "0xac7605770e89ef96f68a081815b2fb8d59532896")
//getSome(addr.WETH, "0x87379c15810e77502e436ab8f06794cc662d39a5")
//getSome("0xa623b2DD931C5162b7a0B25852f4024Db48bb1A0","0x7f9d39de53a3036463146e91e921cc9fbfcb2de4")
//upgrade()
//approve(addr.fDAI, superAppAddress, '100000000000000000000000' )
//approve(addr.DAI, superAppAddress, '100000000000000000000000' )
//approve(addr.WETH, superAppAddress, '100000000000000000000000' )
//mintDAI("200000000000000000000")
//deposit(addr.WETH, "20000000000000000000", PUBLIC_KEY)
//deposit(addr.DAI, "20000000000000000000", PUBLIC_KEY)
//grant(PUBLIC_KEY, "20000000000000000000")
authFactory()

 //clone("The Backee", "EEE", '10000000000000000000000000000')
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

// npx hardhat run scripts/deploy.js --network mumbai
// npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS
// npx hardhat node --fork https://eth-kovan.alchemyapi.io/v2/n_mDCfTpJ8I959arPP7PwiOptjubLm57 --fork-block-number 28431621
// npx hardhat node --fork https://eth-rinkeby.alchemyapi.io/v2/n_mDCfTpJ8I959arPP7PwiOptjubLm57 --fork-block-number 9664019