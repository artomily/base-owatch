// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OWATCH Token Contract (Simplified)
 * @dev Simple ERC20 token for O'Watch.ID watch-to-earn platform
 */
contract OWATCH is ERC20, Ownable {
    // Mapping untuk user registration
    mapping(address => bool) public isRegistered;
    mapping(address => uint256) public userBalance;

    // Events
    event UserRegistered(address indexed user);
    event RewardEarned(address indexed user, uint256 amount);

    // Constants
    uint256 public constant REWARD_PER_MINUTE = 10 * 10**18; // 10 OWATCH per minute
    uint256 public constant MIN_WATCH_TIME = 1 minutes;

    constructor(uint256 initialSupply) ERC20("O'Watch Token", "OWATCH") {
        _mint(msg.sender, initialSupply * 10**18);
    }

    /**
     * @dev Register user
     */
    function registerUser() external {
        require(!isRegistered[msg.sender], "Already registered");
        isRegistered[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    /**
     * @dev Record watch time and earn rewards
     * @param minutesWatched Minutes watched
     */
    function earnReward(uint256 minutesWatched) external {
        require(isRegistered[msg.sender], "Not registered");
        require(minutesWatched >= 1, "Minimum 1 minute");

        uint256 reward = minutesWatched * REWARD_PER_MINUTE;
        _mint(msg.sender, reward);
        userBalance[msg.sender] += reward;

        emit RewardEarned(msg.sender, reward);
    }

    /**
     * @dev Get user info
     */
    function getUserInfo(address user) external view returns (bool registered, uint256 balance) {
        return (isRegistered[user], userBalance[user]);
    }

    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= balanceOf(address(this)), "Insufficient balance");
        _transfer(address(this), msg.sender, amount);
    }
}
