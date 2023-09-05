// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP7DigitalAsset/presets/ILSP7Mintable.sol";
import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/ILSP8Mintable.sol";

interface ITwutLSP7 is ILSP7Mintable {
  function burn(address from, uint256 amount, bytes memory data) external;
}

contract TwutMain is ReentrancyGuard {
  ITwutLSP7 TwutToken;
  ILSP8Mintable TwutNFT;
  uint256 priceOfToken = 2;
  uint256 costPerTwut;
  uint256 costPerLike;
  uint256 costPerRetwut;
  address public owner;

  modifier onlyOwner() {
    require (msg.sender == owner);
    _;
  }

  constructor(
    uint256 _costPerLike, 
    uint256 _costPerTwut, 
    uint256 _costPerRetwut, 
    address _twutToken, 
    address _twutNFT) {
      costPerLike = _costPerLike;
      costPerTwut = _costPerTwut;
      costPerRetwut = _costPerRetwut;
      TwutToken = ITwutLSP7(_twutToken);
      TwutNFT = ILSP8Mintable(_twutNFT);
      owner = msg.sender;
  }

  function twut(bytes32 _tokenId) public nonReentrant {
    require(
      TwutToken.balanceOf(msg.sender) >= costPerTwut,
      "not enough balance to pay for twut"
    );
    TwutNFT.mint(msg.sender, _tokenId, true, '0x');
    TwutToken.burn(msg.sender, costPerTwut, '0x');
  }

  function like(bytes32 _tokenId) public nonReentrant {
    require(
      TwutToken.balanceOf(msg.sender) >= costPerLike,
      "not enough balance to pay for like"
    );
    address tweetOwner = TwutNFT.tokenOwnerOf(_tokenId);
    // likesCountPerTweet[_tokenId]++;
    // likersPerTweet[_tokenId].push(msg.sender);
    TwutToken.transfer(msg.sender, tweetOwner, costPerLike, true, '0x');
  }

  function retwut(bytes32 _tokenId) public nonReentrant {
    require(
      TwutToken.balanceOf(msg.sender) >= costPerRetwut,
      "not enough balance to pay for retwut"
    );
    address tweetOwner = TwutNFT.tokenOwnerOf(_tokenId);
    // retweetCountPerTweet[_tokenId]++;
    TwutToken.transfer(msg.sender, tweetOwner, costPerRetwut, true, '0x');
  }

  function buyToken() public payable nonReentrant {
    require(msg.value > 0, "Amount should be > 0");
    require(
      msg.value % priceOfToken == 0, 
      "Amount is not correct (amount % price != 0)"
    );
    uint256 amountToBeGiven = msg.value / priceOfToken;
    TwutToken.mint(msg.sender, amountToBeGiven, true, '0x');
  }

  function withdraw() public onlyOwner {
    payable(owner).transfer(address(this).balance);
  }
}