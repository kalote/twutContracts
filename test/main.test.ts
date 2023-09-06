import { expect } from 'chai';
import { ethers } from 'hardhat';
import {
  TwutMain,
  TwutMain__factory,
  TwutNFT,
  TwutNFT__factory,
  TwutToken,
  TwutToken__factory,
} from '../typechain-types';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

const AMOUNT_TOKEN = 30;
const COST_PER_LIKE = 10;
const COST_PER_TWUT = 30;
const COST_PER_RETWUT = 20;

describe('Twut Main contract', function () {
  let twutToken: TwutToken;
  let twutNFT: TwutNFT;
  let twutMain: TwutMain;
  let owner: HardhatEthersSigner;
  let user: HardhatEthersSigner;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    user = signers[1];
    twutToken = await new TwutToken__factory(owner).deploy();
    twutNFT = await new TwutNFT__factory(owner).deploy();
    twutMain = await new TwutMain__factory(owner).deploy(
      COST_PER_LIKE,
      COST_PER_TWUT,
      COST_PER_RETWUT,
      await twutToken.getAddress(),
      await twutNFT.getAddress(),
    );
  });

  describe('Twut function', () => {
    it('must have enough balance', async () => {
      const tx = twutMain.connect(user).twut(ethers.encodeBytes32String('1'));
      await expect(tx).to.be.revertedWith('not enough balance to pay for twut');
    });

    it('successful twut', async () => {
      const TOKEN_ID = 1;

      // mint
      const mintTx = await twutToken.mint(user.address, AMOUNT_TOKEN, true, '0x');
      mintTx.wait();

      // authorize LSP7
      const authorizeTx = await twutToken
        .connect(user)
        .authorizeOperator(await twutMain.getAddress(), AMOUNT_TOKEN);
      authorizeTx.wait();

      // authorize LSP8
      // fail due to nonExistentTokenId
      // const authorizeNFTTx = await twutNFT
      //   .connect(user)
      //   .authorizeOperator(await twutMain.getAddress(), ethers.encodeBytes32String('1'));
      // authorizeNFTTx.wait();

      // // twut
      // fail due to Ownable: caller is not the owner
      const twutTx = await twutMain.connect(user).twut(ethers.encodeBytes32String('1'));
      twutTx.wait();

      // // check balance
      const balanceTx = await twutToken.balanceOf(user.address);
      expect(balanceTx).to.be.equal(0);

      // // assert NFT created & owned by user
      expect(await twutNFT.tokenOwnerOf(ethers.encodeBytes32String('1'))).to.be.equals(user.address);
    });
  });
});
