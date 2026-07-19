// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RentDepositVault is Ownable, ReentrancyGuard {
    // Arbitrum V3 Addresses
    IPool public constant AAVE_POOL = IPool(0x794a61358D052d59C348259695628249a5D86326);
    IERC20 public constant USDC = IERC20(0xaf88d065e77c8cC2239327C5EDb3A432268e5831);

    mapping(address => uint256) public deposits;

    event Deposit(address indexed user, uint256 amount);
    event Release(address indexed user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // UX Feature: Simple deposit for Universal Accounts
    function deposit(uint256 amount) external nonReentrant {
        USDC.transferFrom(msg.sender, address(this), amount);
        USDC.approve(address(AAVE_POOL), amount);
        AAVE_POOL.supply(address(USDC), amount, address(this), 0);
        deposits[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    // UX Feature: One-click release (Admin-triggered for Pilot)
    function release(address user, uint256 amount) external onlyOwner nonReentrant {
        AAVE_POOL.withdraw(address(USDC), amount, user);
        deposits[user] -= amount;
        emit Release(user, amount);
    }
}