// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/extensions/LSP7Burnable.sol";

contract TwutToken is LSP7Mintable, LSP7Burnable {
  constructor() LSP7Mintable("Twut", "TWU", msg.sender, false) {
    mint(msg.sender, 2000 * 10**decimals(), true, '0x' );
  }
}