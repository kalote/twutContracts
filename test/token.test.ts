import { expect } from 'chai';
import { ethers } from 'hardhat';
import { TwutToken, TwutToken__factory } from '../typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

const BASE_SUPPLY = 2000;

describe('Twut Token LSP7 contract', function () {
  let twutToken: TwutToken;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    twutToken = await new TwutToken__factory(owner).deploy();
  });

  it('Deployment should assign 2k tokens to the owner', async function () {
    const ownerBalance = ethers.formatEther(await twutToken.balanceOf(owner.address));

    expect(BASE_SUPPLY).to.equal(Number(ownerBalance));
  });

  it('Must receive token if mint', async function () {
    const tx = await twutToken.mint(user.address, '200', true, '0x');
    tx.wait();

    const balanceTx = await twutToken.balanceOf(user.address);
    expect(balanceTx).to.be.equal(200);
  });
});
