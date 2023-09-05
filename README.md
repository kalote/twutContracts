# Twut Hardhat Project

Twut smart-contracts to be deployed on LUKSO blockchain. The contracts are using LSP7 / LSP8 standards.

- create a `.env` file with your `PRIVATE_KEY` and `UP_ADDR`
- run `npm i`
- run `npm run build` to compile contracts & types
- run `npx hardhat --network luksoTestnet run scripts/deploy.ts` to deploy the contract on LUKSO testnet as the UP controlled by the EOA linked to the `PRIVATE_KEY`
- run `npx hardhat --network luksoTestnet run scripts/deployEOA.ts` to deploy the contract on LUKSO testnet as the EOA linked to the `PRIVATE_KEY`

## Info

- Twut token (LSP7) address: 0xc3eb450aa16153c948ddcc6f42a76bcf856ea92d
- Twut NFT (LSP8) address: 0x6f931e5236a732c376ee6f4143ba6ee943d55180
- Main contract address: 0x80bb32ec28aa11697faead80a0ee11a2dfd3cb01
