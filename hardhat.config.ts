import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-etherscan";
import { task, HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

dotenv.config();
const PKS=[process.env.MY_PK!]
const config: HardhatUserConfig = {
  solidity: "0.8.7",
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice:15000000000,
      accounts:PKS,
    },

    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: PKS,
    },
  },
  etherscan: {
    apiKey:process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
