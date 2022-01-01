import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../typechain/Token";

const tokenDetails = {
  name: "1S218PA0031A",
  symbol: "1S218PA0031A",
  totalySupply: "21000000" + "0".repeat(8) ,
  decimals: "0".repeat(8)
};

describe("Payment", () => {
  let merchant: SignerWithAddress;
  let admin: SignerWithAddress;
  let subscriber: SignerWithAddress;
  let token: Token;

  before(async () => {
    [admin, merchant, subscriber] = await ethers.getSigners();
  });

  beforeEach(async () => {
    let Token = await ethers.getContractFactory("Token");
    token = (await Token.deploy()) as Token;
  });

  it("Check token details", async () => {
    expect(await token.name()).equal(tokenDetails.name);
    expect(await token.symbol()).equal(tokenDetails.symbol);
    expect(await token.totalSupply()).equal(tokenDetails.totalySupply);
    expect(await token.decimals).equal(tokenDetails.decimals);
  });

  it("Balance", async () => {
    let a = await token.balanceOf(admin.address);
    expect(a).equal(tokenDetails.totalySupply);
    expect(await token.owner()).equal(admin.address);
  });

  it("Transfer Ownership", async () => {
    expect(await token.owner()).equal(admin.address);
    token.transferOwnership(subscriber.address);
    expect(await token.owner()).equal(subscriber.address);
    expect(await token.owner()).not.equal(admin.address);
  });
});
