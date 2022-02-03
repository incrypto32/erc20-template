import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../typechain-types/Token";

const tokenDetails = {
  name: "LEALS",
  symbol: "LEAL",
  totalySupply: "21000000000" + "0".repeat(18),
  decimals: 18,
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
    expect(await token.decimals()).equal(tokenDetails.decimals);
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

  it("Blacklist Check", async () => {
    token.transfer(merchant.address, 1000);
    await token.updateBlacklist(merchant.address, true);
    expect(token.transfer(merchant.address, 1000)).to.revertedWith("Token transfer refused. Receiver is on blacklist");
    expect(token.connect(merchant).transfer(admin.address, 1000)).to.revertedWith(
      "Token transfer refused. Receiver is on blacklist"
    );
  });

  it("Tax Check", async () => {
    await token.updateTaxWallet(merchant.address);
    expect(await token.taxWallet()).equal(merchant.address);
    await token.transfer(subscriber.address, 100);
    expect(await token.balanceOf(merchant.address)).eq(5);
    expect(await token.balanceOf(subscriber.address)).eq(95);
  });

  it("Tax Fee Check", async () => {
    await token.updateTaxWallet(merchant.address);
    expect(await token.taxWallet()).equal(merchant.address);
    await token.updateTaxRate(200);
    expect(await token.taxRate()).eq(200);
    await token.transfer(subscriber.address, 100);
    expect(await token.balanceOf(merchant.address)).eq(2);
    expect(await token.balanceOf(subscriber.address)).eq(98);
  });
});
