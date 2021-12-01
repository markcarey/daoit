async function main() {
    const tokenContract = await ethers.getContractFactory("NativeSuperTokenProxy");
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


    const appFactoryContract = await ethers.getContractFactory("DAOSuperAppFactory");
    const appFactory = await appFactoryContract.deploy();
    console.log("appFactory deployed to address:", appFactory.address);
    const govFactoryContract = await ethers.getContractFactory("DAOGovernanceFactory");
    const govFactory = await govFactoryContract.deploy();
    console.log("govFactory deployed to address:", govFactory.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });

// npx hardhat run scripts/deploy.js --network localhost
// npx hardhat verify --network rinkeby DEPLOYED_CONTRACT_ADDRESS
// npx hardhat node --fork https://eth-rinkeby.alchemyapi.io/v2/n_mDCfTpJ8I959arPP7PwiOptjubLm57 --fork-block-number 9734005