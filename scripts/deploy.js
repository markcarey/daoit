require('dotenv').config();
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const appFactoryJSON = require("../artifacts/contracts/DAOit.sol/DAOFactory.json");
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

const tokenJSON = require("../artifacts/contracts/token/DAOToken.sol/DAOToken.json");
const appJSON = require("../artifacts/contracts/DAOSuperApp.sol/DAOSuperApp.json");
const govJSON = require("../artifacts/contracts/governance/Governor.sol/DAOGovernor.json");
const execJSON = require("../artifacts/contracts/DAOit.sol/DAOExecutor.json");

const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function main(stf) {

    const c2factory = new ethers.Contract(c2factoryAddress, c2factoryAbi, signer);
    var filter = await c2factory.filters.Deployed();
    
    var salt;

    const tokenContract = await ethers.getContractFactory("DAOToken");
    const token = await tokenContract.deploy();
    console.log("token deployed to address:", token.address);
    //return;
    const appContract = await ethers.getContractFactory("DAOSuperApp");
    const app = await appContract.deploy();
    console.log("app deployed to address:", app.address);
    const govContract = await ethers.getContractFactory("DAOGovernor");
    const gov = await govContract.deploy();
    console.log("gov deployed to address:", gov.address);
    const execContract = await ethers.getContractFactory("DAOExecutor");
    const exec = await execContract.deploy();
    console.log("exec deployed to address:", exec.address);

    //return;


    //const appFactoryContract = await ethers.getContractFactory("DAOFactory");
    //const appFactory = await appFactoryContract.deploy();
    //console.log("appFactory deployed to address:", appFactory.address);

    //const factoryFactoryContract = await ethers.getContractFactory("FactoryFactory");
    //const factoryFactory = await factoryFactoryContract.deploy();
    //console.log("factoryFactory deployed to address:", factoryFactory.address);

    var c = {};
    var result;

    var v = "17";
    const tokenSalt = ethers.utils.id("TOKEN"+v);
    const appSalt = ethers.utils.id("APP"+v);
    const govSalt = ethers.utils.id("GOV"+v);
    const execSalt = ethers.utils.id("EXEC"+v);
    const factorySalt = ethers.utils.id("FACTORY"+v);

    c2factory.on(filter, async (address, salt, event) => { 
      //console.log("tokenSalt", tokenSalt);
      //console.log("salt", salt);
      //console.log("salt as hex", salt.toHexString() );
      if ( salt.toHexString() == appSalt ) {
        console.log("app impl created at " + address);
        c.app = address;
      } else if ( salt.toHexString() == tokenSalt ) {
        console.log("token impl created at " + address);
        c.token = address;
      } else if ( salt.toHexString() == govSalt ) {
        console.log("gov impl created at " + address);
        c.gov = address;
      } else if ( salt.toHexString() == execSalt ) {
        console.log("exec impl created at " + address);
        c.exec = address;
      } else if ( salt.toHexString() == factorySalt ) {
        console.log("app factory created at " + address);
        var appFactoryAddress = address;
        let daoFactory = new ethers.Contract(
          appFactoryAddress,
          appFactoryJSON.abi,
          signer
        );
        const init = await daoFactory.initialize(
          stf,
          c.app,
          c.token,
          c.gov,
          c.exec
        );
        await init.wait(5);
      }
    });


    result = await c2factory.deploy(tokenJSON.bytecode, tokenSalt);
    await result.wait();

    result = await c2factory.deploy(appJSON.bytecode, appSalt);
    await result.wait();

    result = await c2factory.deploy(govJSON.bytecode, govSalt);
    await result.wait();

    result = await c2factory.deploy(execJSON.bytecode, execSalt);
    await result.wait();
    
    result = await c2factory.deploy(appFactoryJSON.bytecode, factorySalt);
    await sleep(25000);
    await result.wait();

    //const deployedAppFactory = await factoryFactory.createDaoFactory(
    //  stf,
    //  app.address,
    //  token.address,
    //  gov.address,
    //  exec.address,
    //  appFactory.address
    //);
    //var filter = await factoryFactory.filters.DAOFactoryCreated();
    //factoryFactory.on(filter, (owner, deployedAppFactory, event) => { 
    //  console.log("deployedAppFactory deployed to address:", deployedAppFactory);
    //});
    //await sleep(15000);
    
    //const govFactoryContract = await ethers.getContractFactory("DAOGovernanceFactory");
    //const govFactory = await govFactoryContract.deploy();
    //console.log("govFactory deployed to address:", govFactory.address);
 }
 
 main("0xd465e36e607d493cd4CC1e83bea275712BECd5E0") // rinkeby
// main("0x200657E2f123761662567A1744f9ACAe50dF47E6") // mumbai
//main("0x2C90719f25B10Fc5646c82DA3240C76Fa5BcCF34") // polygon
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

// npx hardhat run scripts/deploy.js --network localhost
// npx hardhat verify --network rinkeby 0x1403F69Bae0E21d4126A1592BE86b0018eb27207
// npx hardhat node --fork https://eth-rinkeby.alchemyapi.io/v2/n_mDCfTpJ8I959arPP7PwiOptjubLm57 --fork-block-number 9734005