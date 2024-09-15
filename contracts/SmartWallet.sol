// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartWallet {
    // State variable to store the owner of the wallet
    address public owner;
    
    // Recovery address for lost access
    address public recoveryAddress;

    // Events
    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);
    event Transfer(address indexed to, uint256 amount);
    
    // Modifier to restrict functions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Modifier for recovery address
    modifier onlyRecovery() {
        require(msg.sender == recoveryAddress, "Not the recovery address");
        _;
    }

    // Constructor to set the initial owner
    constructor(address _recoveryAddress) {
        owner = msg.sender;
        recoveryAddress = _recoveryAddress;
    }

    // Function to deposit ETH
    function deposit() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Function to withdraw ETH to a specified address
    function withdraw(uint256 amount, address payable to) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit Withdraw(to, amount);
    }

    // Function to transfer ETH from the contract to another address
    function transferTo(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit Transfer(to, amount);
    }

    // Fallback function to receive ETH
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Recovery mechanism to reset the owner in case of lost access
    function setNewOwner(address newOwner) external onlyRecovery {
        owner = newOwner;
    }

    // Get the balance of the wallet
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
