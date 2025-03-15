require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,    // URL из Infura / Alchemy для sepolia
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
