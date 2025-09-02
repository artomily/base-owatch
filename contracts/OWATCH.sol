// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title OWATCH Token Contract
 * @dev ERC20 token for O'Watch.ID watch-to-earn platform
 * @notice This contract handles user rewards, video watching verification, and token distribution
 */
contract OWATCH is ERC20, Ownable, ReentrancyGuard {
    // Structs
    struct User {
        uint256 totalWatchedTime;      // Total time watched in seconds
        uint256 totalEarned;          // Total OWATCH earned
        uint256 lastClaimTime;        // Last claim timestamp
        uint256 streakDays;           // Current watching streak
        bool isRegistered;            // Registration status
    }

    struct Video {
        bytes32 videoId;              // Unique video identifier
        uint256 duration;             // Video duration in seconds
        uint256 rewardPerSecond;      // OWATCH reward per second watched
        address creator;              // Video creator address
        bool isActive;                // Video active status
    }

    // State variables
    mapping(address => User) public users;
    mapping(bytes32 => Video) public videos;
    mapping(address => mapping(bytes32 => uint256)) public userVideoProgress; // user => videoId => watched seconds

    uint256 public constant MAX_REWARD_PER_SECOND = 10 * 10**18; // 10 OWATCH per second max
    uint256 public constant MIN_WATCH_TIME = 30; // Minimum 30 seconds to earn rewards
    uint256 public constant CLAIM_COOLDOWN = 1 hours; // 1 hour cooldown between claims

    // Events
    event UserRegistered(address indexed user);
    event VideoWatched(address indexed user, bytes32 indexed videoId, uint256 watchedTime, uint256 reward);
    event RewardClaimed(address indexed user, uint256 amount);
    event VideoAdded(bytes32 indexed videoId, address indexed creator, uint256 duration, uint256 rewardPerSecond);
    event VideoUpdated(bytes32 indexed videoId, uint256 newRewardPerSecond);

    // Modifiers
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }

    modifier validVideo(bytes32 videoId) {
        require(videos[videoId].isActive, "Video not active");
        _;
    }

    modifier canClaim() {
        require(block.timestamp >= users[msg.sender].lastClaimTime + CLAIM_COOLDOWN, "Claim cooldown active");
        _;
    }

    /**
     * @dev Constructor
     * @param initialSupply Initial token supply (with 18 decimals)
     */
    constructor(uint256 initialSupply) ERC20("O'Watch Token", "OWATCH") {
        _mint(msg.sender, initialSupply * 10**18);
    }

    /**
     * @dev Register a new user
     */
    function registerUser() external {
        require(!users[msg.sender].isRegistered, "User already registered");

        users[msg.sender] = User({
            totalWatchedTime: 0,
            totalEarned: 0,
            lastClaimTime: 0,
            streakDays: 0,
            isRegistered: true
        });

        emit UserRegistered(msg.sender);
    }

    /**
     * @dev Add a new video to the platform
     * @param videoId Unique video identifier
     * @param duration Video duration in seconds
     * @param rewardPerSecond OWATCH reward per second watched
     */
    function addVideo(
        bytes32 videoId,
        uint256 duration,
        uint256 rewardPerSecond
    ) external onlyOwner {
        require(videos[videoId].videoId == bytes32(0), "Video already exists");
        require(rewardPerSecond > 0 && rewardPerSecond <= MAX_REWARD_PER_SECOND, "Invalid reward rate");
        require(duration >= MIN_WATCH_TIME, "Video too short");

        videos[videoId] = Video({
            videoId: videoId,
            duration: duration,
            rewardPerSecond: rewardPerSecond,
            creator: msg.sender,
            isActive: true
        });

        emit VideoAdded(videoId, msg.sender, duration, rewardPerSecond);
    }

    /**
     * @dev Update video reward rate
     * @param videoId Video identifier
     * @param newRewardPerSecond New reward per second
     */
    function updateVideoReward(
        bytes32 videoId,
        uint256 newRewardPerSecond
    ) external onlyOwner validVideo(videoId) {
        require(newRewardPerSecond > 0 && newRewardPerSecond <= MAX_REWARD_PER_SECOND, "Invalid reward rate");

        videos[videoId].rewardPerSecond = newRewardPerSecond;
        emit VideoUpdated(videoId, newRewardPerSecond);
    }

    /**
     * @dev Record video watching progress
     * @param videoId Video identifier
     * @param watchedSeconds Time watched in seconds
     */
    function recordWatchTime(
        bytes32 videoId,
        uint256 watchedSeconds
    ) external onlyRegistered validVideo(videoId) nonReentrant {
        require(watchedSeconds >= MIN_WATCH_TIME, "Watch time too short");
        require(watchedSeconds <= videos[videoId].duration, "Watch time exceeds video duration");

        Video memory video = videos[videoId];
        uint256 previousProgress = userVideoProgress[msg.sender][videoId];

        // Only reward for new progress
        if (watchedSeconds > previousProgress) {
            uint256 newProgress = watchedSeconds - previousProgress;
            uint256 reward = newProgress * video.rewardPerSecond;

            // Update user progress
            userVideoProgress[msg.sender][videoId] = watchedSeconds;
            users[msg.sender].totalWatchedTime += newProgress;
            users[msg.sender].totalEarned += reward;

            // Mint reward tokens to user
            _mint(msg.sender, reward);

            emit VideoWatched(msg.sender, videoId, newProgress, reward);
        }
    }

    /**
     * @dev Claim accumulated rewards (if needed for future features)
     */
    function claimRewards() external onlyRegistered canClaim nonReentrant {
        uint256 claimableAmount = balanceOf(msg.sender) - users[msg.sender].totalEarned;

        if (claimableAmount > 0) {
            users[msg.sender].lastClaimTime = block.timestamp;
            emit RewardClaimed(msg.sender, claimableAmount);
        }
    }

    /**
     * @dev Get user statistics
     * @param user User address
     */
    function getUserStats(address user) external view returns (
        uint256 totalWatchedTime,
        uint256 totalEarned,
        uint256 currentBalance,
        uint256 streakDays,
        bool isRegistered
    ) {
        User memory userData = users[user];
        return (
            userData.totalWatchedTime,
            userData.totalEarned,
            balanceOf(user),
            userData.streakDays,
            userData.isRegistered
        );
    }

    /**
     * @dev Get video information
     * @param videoId Video identifier
     */
    function getVideoInfo(bytes32 videoId) external view returns (
        uint256 duration,
        uint256 rewardPerSecond,
        address creator,
        bool isActive
    ) {
        Video memory video = videos[videoId];
        return (
            video.duration,
            video.rewardPerSecond,
            video.creator,
            video.isActive
        );
    }

    /**
     * @dev Get user progress on a specific video
     * @param user User address
     * @param videoId Video identifier
     */
    function getUserVideoProgress(address user, bytes32 videoId) external view returns (uint256) {
        return userVideoProgress[user][videoId];
    }

    /**
     * @dev Emergency withdraw tokens (only owner)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= balanceOf(address(this)), "Insufficient contract balance");
        _transfer(address(this), msg.sender, amount);
    }

    /**
     * @dev Pause/unpause video
     * @param videoId Video identifier
     * @param active New active status
     */
    function setVideoActive(bytes32 videoId, bool active) external onlyOwner {
        require(videos[videoId].videoId != bytes32(0), "Video does not exist");
        videos[videoId].isActive = active;
    }
}
