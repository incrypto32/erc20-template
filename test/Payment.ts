import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../typechain/Token";

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

  it("Balance", async () => {
    let a = await token.balanceOf(admin.address);
    expect(a).equal("269000000000000000000000000");
    expect(await token.owner()).equal(admin.address);
  });

  it("Transfer Ownership", async () => {
    expect(await token.owner()).equal(admin.address);
    token.transferOwnership(subscriber.address);
    expect(await token.owner()).equal(subscriber.address);
    expect(await token.owner()).not.equal(admin.address);
  });
});