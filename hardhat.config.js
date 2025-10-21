require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26",
  settings: {
    optimizer: {
      enabled: false, // ou true se foi usado no deploy
      runs: 200
    }
  }
};
