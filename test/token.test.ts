import { expect } from "chai";
import { ethers } from "hardhat";
import { TwutToken__factory } from "../typechain-types";

const BASE_SUPPLY = 2000;
 
describe("Twut Token LSP7 contract", function () {
  it("Deployment should assign 2k tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const twutToken = await new TwutToken__factory(owner).deploy();

    const ownerBalance = ethers.formatEther(await twutToken.balanceOf(owner.address));

    expect(BASE_SUPPLY).to.equal(Number(ownerBalance));
  });
});