/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-waffle");
const { API_URL, MUMBAI_API_URL, POLYGON_API_URL, PRIVATE_KEY, ETHERSCAN_API_KEY, POLYSCAN_API_KEY } = process.env;
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1
          }
        }
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1
          }
        }
      },
      {
        version: "0.4.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1
          }
        }
      }
    ] 
},
   defaultNetwork: "mumbai",
   networks: {
      hardhat: {
        accounts: [{ privateKey: `0x${PRIVATE_KEY}`, balance: "10000000000000000000000"}],
        forking: {
          url: MUMBAI_API_URL,
          blockNumber: 24222206  // assumes mumbai fork
        },
        loggingEnabled: true,
        gasMultiplier: 7,
        gasPrice: 1000000000 * 5,
        blockGasLimit: 0x1fffffffffffff
      },
      rinkeby: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],
        gasMultiplier: 10,
        gasPrice: 1000000000 * 10,
        blockGasLimit: 0x1fffffffffffff
     },
     mumbai: {
      url: MUMBAI_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gasMultiplier: 3,
      gasPrice: 1000000000 * 2
    },
    polygon: {
      url: POLYGON_API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      //gasMultiplier: 3,
      //gasPrice: 1000000000 * 2
    }
   },
   etherscan: {
    apiKey: POLYSCAN_API_KEY
  }
}

// 
// npx hardhat node --fork https://eth-kovan.alchemyapi.io/v2/n_mDCfTpJ8I959arPP7PwiOptjubLm57 --fork-block-number 28431621