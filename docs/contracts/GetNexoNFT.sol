// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GetNexoNFT is ERC721URIStorage, Ownable {
    uint256 public tokenIds;

    constructor() ERC721("GetNexo Loyalty", "NEXO") Ownable(msg.sender) {}

    function mint(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        tokenIds++;
        uint256 newItemId = tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
