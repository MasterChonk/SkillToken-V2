require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   networks: {
    hardhat: {
      chainId: 1000 // Hardhat Network ID
    }
  },
  solidity: "0.8.28",
};