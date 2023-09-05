import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

const COST_PER_LIKE = 10;
const COST_PER_TWUT = 30;
const COST_PER_RETWUT = 20;

async function main() {
  let twutToken = await ethers.getContractFactory('TwutToken');
  let twutNFT = await ethers.getContractFactory('TwutNFT');
  let twutMain = await ethers.getContractFactory('TwutMain');

  const Token = await twutToken.deploy();
  const token = await Token.waitForDeployment();
  const TwutTokenAddress = await token.getAddress();
  console.log(`Token address: ${TwutTokenAddress}`);

  const NFT = await twutNFT.deploy();
  const nft = await NFT.waitForDeployment();
  const TwutNFTAddress = await nft.getAddress();
  console.log(`NFT address: ${TwutNFTAddress}`);

  const Main = await twutMain.deploy(
    COST_PER_LIKE,
    COST_PER_TWUT,
    COST_PER_RETWUT,
    TwutTokenAddress,
    TwutNFTAddress,
  );
  const main = await Main.waitForDeployment();
  const TwutMainAddress = await main.getAddress();
  console.log(`Main address: ${TwutMainAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
