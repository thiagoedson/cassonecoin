// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// Configuration
const INITIAL_SUPPLY = 1_000_000; // 1 million CASS tokens

module.exports = buildModule("CassoneCoinModule", (m) => {
  // Get initial supply from parameters or use default
  const initialSupply = m.getParameter("initialSupply", INITIAL_SUPPLY);

  // Deploy CassoneCoin contract
  const cassoneCoin = m.contract("CassoneCoin", [initialSupply]);

  // Return the deployed contract
  return { cassoneCoin };
});
