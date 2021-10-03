import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../typechain/Token";

const tokenDetails = {
  name: "DRTP Token",
  symbol: "DRTP",
  totalSupply: "1" + "0".repeat(17),
};

const real = (inp: string) => inp + "0".repeat(9);

describe("Payment", () => {
  let merchant: SignerWithAddress;

  let signers: SignerWithAddress[];

  let token: Token;

  before(async () => {
    signers = await ethers.getSigners();
  });

  beforeEach(async () => {
    let Token = await ethers.getContractFactory("Token");
    token = (await Token.deploy()) as Token;
    await token.setCharityWallet(signers[1].address);
    await token.setDevWallet(signers[2].address);
  });

  it("Token Details", async () => {
    expect(await token.totalSupply()).equal(tokenDetails.totalSupply);
    expect(await token.name()).equal(tokenDetails.name);
    expect(await token.symbol()).equal(tokenDetails.symbol);
  });

  it("Wallet set check", async () => {
    expect(await token.charityWallet()).equal(signers[1].address);
    expect(await token.devWallet()).equal(signers[2].address);
  });

  it("Transfer check", async () => {
    await token.transfer(signers[4].address, real("100"));
    expect(await token.balanceOf(signers[4].address)).equal(real("100"));
    await token.connect(signers[4]).transfer(signers[5].address, real("100"));
    expect(await token.balanceOf(signers[1].address)).equal(real("3"));
    expect(await token.balanceOf(signers[2].address)).equal(real("3"));
  });

  it("Balance", async () => {
    let a = await token.balanceOf(signers[0].address);
    expect(a).equal(tokenDetails.totalSupply);
    expect(await token.owner()).equal(signers[0].address);
  });

  it("Transfer Ownership", async () => {
    expect(await token.owner()).equal(signers[0].address);
    token.transferOwnership(signers[1].address);
    expect(await token.owner()).equal(signers[1].address);
    expect(await token.owner()).not.equal(signers[0].address);
  });
});
