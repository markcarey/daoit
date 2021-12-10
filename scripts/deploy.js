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

const signer = new ethers.Wallet(PRIVATE_KEY, ethers.provider);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function main(stf) {
    const tokenContract = await ethers.getContractFactory("DAOToken");
    const token = await tokenContract.deploy();
    console.log("token deployed to address:", token.address);
    const appContract = await ethers.getContractFactory("DAOSuperApp");
    const app = await appContract.deploy();
    console.log("app deployed to address:", app.address);
    const govContract = await ethers.getContractFactory("DAOGovernor");
    const gov = await govContract.deploy();
    console.log("gov deployed to address:", gov.address);
    const execContract = await ethers.getContractFactory("DAOExecutor");
    const exec = await execContract.deploy();
    console.log("exec deployed to address:", exec.address);


    //const appFactoryContract = await ethers.getContractFactory("DAOFactory");
    //const appFactory = await appFactoryContract.deploy();
    //console.log("appFactory deployed to address:", appFactory.address);

    //const factoryFactoryContract = await ethers.getContractFactory("FactoryFactory");
    //const factoryFactory = await factoryFactoryContract.deploy();
    //console.log("factoryFactory deployed to address:", factoryFactory.address);

    const c2factory = new ethers.Contract(c2factoryAddress, c2factoryAbi, signer);
    const salt = ethers.utils.id("VERSION1");
    const result = await c2factory.deploy(appFactoryJSON.bytecode, salt);
    var filter = await c2factory.filters.Deployed();
    c2factory.on(filter, async (appFactoryAddress, salt, event) => { 
        console.log("app factory created at " + appFactoryAddress);
        let daoFactory = new ethers.Contract(
          appFactoryAddress,
          appFactoryJSON.abi,
          signer
        );
        await daoFactory.initialize(
          stf,
          app.address,
          token.address,
          gov.address,
          exec.address
        );
    });
    await sleep(15000);

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
 
 //main("0xd465e36e607d493cd4CC1e83bea275712BECd5E0") // rinkeby
 main("0x200657E2f123761662567A1744f9ACAe50dF47E6") // mumbai
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

// npx hardhat run scripts/deploy.js --network localhost
// npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS
// npx hardhat node --fork https://eth-rinkeby.alchemyapi.io/v2/n_mDCfTpJ8I959arPP7PwiOptjubLm57 --fork-block-number 9734005