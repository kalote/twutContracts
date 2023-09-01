import { ethers as HardhatEthers } from "hardhat";
import { readFile } from "fs/promises";
import hre from "hardhat";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as LSP0ABI from "@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json";

dotenv.config();

const COST_PER_LIKE = 10;
const COST_PER_TWUT = 30;
const COST_PER_RETWUT = 20;
const UP_ADDR = "0xaca4e32D1Fed6F23384BFe4FebB9f4AaFE644d5f";

async function main() {
  // setup provider
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.testnet.lukso.network"
  );
  // setup signer (the browser extension controller)
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
  console.log("Deploying contracts with the account: ", signer.address);

  // load the associated UP
  const UP = new ethers.Contract(UP_ADDR, LSP0ABI.abi, provider);

  /**
   * Twut LSP7 Token
   */
  const TwutTokenBytecode =
    hre.artifacts.readArtifactSync("TwutToken").bytecode;

  // get the address of the contract created (as bytes)
  const TwutTokenAddress = await UP.connect(signer).callStatic.execute(
    1,
    ethers.constants.AddressZero,
    0,
    TwutTokenBytecode
  );

  // deploy TwutLSP7 as the UP (signed by the browser extension controller)
  await UP.connect(signer).execute(
    1,
    ethers.constants.AddressZero,
    0,
    TwutTokenBytecode
  );

  console.log("Twut token address: ", TwutTokenAddress);

  /**
   * Twut LSP8 NFT
   */
  const TwutNFTBytecode = hre.artifacts.readArtifactSync("TwutNFT").bytecode;

  // get the address of the contract created (as bytes)
  const TwutNFTAddress = await UP.connect(signer).callStatic.execute(
    1,
    ethers.constants.AddressZero,
    0,
    TwutNFTBytecode
  );

  // deploy TwutLSP8 as the UP (signed by the browser extension controller)
  await UP.connect(signer).execute(
    1,
    ethers.constants.AddressZero,
    0,
    TwutNFTBytecode
  );

  console.log("Twut NFT address: ", TwutNFTAddress);

  /**
   * Twut Main
   */
  const TwutMainBytecode = hre.artifacts.readArtifactSync("TwutMain").bytecode;

  // encode the constructor parameters
  const abiCoder = new ethers.utils.AbiCoder();
  const params = abiCoder
    .encode(
      ["uint256", "uint256", "uint256", "address", "address"],
      [
        COST_PER_LIKE,
        COST_PER_TWUT,
        COST_PER_RETWUT,
        TwutTokenAddress,
        TwutNFTAddress,
      ]
    )
    .substring(2);
  const fullBytecode = TwutMainBytecode + params;

  // get the address of the contract created (as bytes)
  const TwutMainAddress = await UP.connect(signer).callStatic.execute(
    1,
    ethers.constants.AddressZero,
    0,
    fullBytecode
  );

  // deploy TwutLSP8 as the UP (signed by the browser extension controller)
  await UP.connect(signer).execute(
    1,
    ethers.constants.AddressZero,
    0,
    fullBytecode
  );

  console.log("Main contract address: ", TwutMainAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
