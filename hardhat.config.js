require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: { enabled: process.env.DEBUG ? false : true },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // blockGasLimit: 518379120000 // whatever you want here
    },
    maticmumbai: {
      url: process.env.POLYGON_ALCHEMY,
      accounts: [
        process.env.PRIVATE_KEY_1,
        process.env.PRIVATE_KEY_2,
        process.env.PRIVATE_KEY_3,
      ],
      // blockGasLimit: 518379120000 // whatever you want here
    },
  },
  // etherscan: {
  //   // Your API key for Etherscan - rinkeby
  //   // Obtain one at https://etherscan.io/
  //   apiKey: "HBMB8ER9AI26GMHR2IAGYK6KS3AX3FA6J1"
  // }
  etherscan: {
    // Your API key for Etherscan - matic
    // Obtain one at https://etherscan.io/
    apiKey: "G23YP8VZFF95Y5S7VZJRP653YPXQE2GGVM",
    // apiKey: {
    //   polygonMumbai: "G23YP8VZFF95Y5S7VZJRP653YPXQE2GGVM",
    // },
  },
};
