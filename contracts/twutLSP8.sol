// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";

contract TwutNFT is LSP8Mintable {
  constructor() LSP8Mintable("TwutNFT", "TWUNFT", msg.sender) {}
}