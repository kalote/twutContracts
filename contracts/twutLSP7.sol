// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/LSP7Mintable.sol";

contract Twut is LSP7Mintable {
  constructor() LSP7Mintable("Twut", "TWU", msg.sender, false) {
    mint(msg.sender, 2000 * 10**decimals(), false, '0x' );
  }
}