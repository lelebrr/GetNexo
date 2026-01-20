// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Mocking OpenZeppelin import for standalone file
contract NexoLoyalty {
    string public name = "Nexo Loyalty Point";
    string public symbol = "NEXO";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);

    constructor() {
        owner = msg.sender;
        // Mint initial supply to owner
        _mint(msg.sender, 1000000 * 10**decimals);
    }

    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    function rewardUser(address user, uint256 amount) external {
        require(msg.sender == owner, "Only owner can mint rewards");
        _mint(user, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
}
