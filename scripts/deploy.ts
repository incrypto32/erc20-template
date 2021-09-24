import { ethers } from "hardhat";
import { Token } from "../typechain/Token";

async function main() {
  const Token = await ethers.getContractFactory("Token");
  const data = Token.interface.encodeDeploy();
  const estimatedGas = await ethers.provider.estimateGas({ data: data });
  console.log(estimatedGas.toString());
  
  const token = (await Token.deploy()) as Token;

  console.log("Token Deployed");
  console.log(token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
