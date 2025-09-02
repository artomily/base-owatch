// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/OWATCH.sol";

contract OWATCHTest is Test {
    OWATCH public owatch;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy contract with 1M initial supply
        owatch = new OWATCH(1_000_000);
    }

    function testInitialSupply() public {
        assertEq(owatch.totalSupply(), 1_000_000 * 10**18);
        assertEq(owatch.balanceOf(owner), 1_000_000 * 10**18);
    }

    function testUserRegistration() public {
        vm.prank(user1);
        owatch.registerUser();

        (bool registered, uint256 balance) = owatch.getUserInfo(user1);
        assertTrue(registered);
        assertEq(balance, 0);
    }

    function testEarnReward() public {
        // Register user first
        vm.prank(user1);
        owatch.registerUser();

        // Earn reward for 5 minutes
        vm.prank(user1);
        owatch.earnReward(5);

        uint256 expectedReward = 5 * 10 * 10**18; // 5 minutes * 10 OWATCH per minute
        assertEq(owatch.balanceOf(user1), expectedReward);

        (, uint256 userBalance) = owatch.getUserInfo(user1);
        assertEq(userBalance, expectedReward);
    }

    function testCannotEarnWithoutRegistration() public {
        vm.prank(user1);
        vm.expectRevert("Not registered");
        owatch.earnReward(5);
    }

    function testMinimumWatchTime() public {
        vm.prank(user1);
        owatch.registerUser();

        vm.prank(user1);
        vm.expectRevert("Minimum 1 minute");
        owatch.earnReward(0);
    }

    function testCannotRegisterTwice() public {
        vm.prank(user1);
        owatch.registerUser();

        vm.prank(user1);
        vm.expectRevert("Already registered");
        owatch.registerUser();
    }

    function testEmergencyWithdraw() public {
        // Transfer some tokens to contract
        owatch.transfer(address(owatch), 1000 * 10**18);

        uint256 ownerBalanceBefore = owatch.balanceOf(owner);
        owatch.emergencyWithdraw(500 * 10**18);

        assertEq(owatch.balanceOf(owner), ownerBalanceBefore + 500 * 10**18);
    }

    function testOnlyOwnerCanEmergencyWithdraw() public {
        owatch.transfer(address(owatch), 1000 * 10**18);

        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        owatch.emergencyWithdraw(500 * 10**18);
    }

    function testTokenTransfer() public {
        uint256 transferAmount = 100 * 10**18;

        owatch.transfer(user1, transferAmount);

        assertEq(owatch.balanceOf(user1), transferAmount);
        assertEq(owatch.balanceOf(owner), (1_000_000 * 10**18) - transferAmount);
    }
}

    function testAddVideo() public {
        uint256 duration = 300; // 5 minutes
        uint256 rewardPerSecond = 1 * 10**18; // 1 OWATCH per second

        owatch.addVideo(videoId1, duration, rewardPerSecond);

        (uint256 videoDuration, uint256 videoReward, address creator, bool isActive) = owatch.getVideoInfo(videoId1);

        assertEq(videoDuration, duration);
        assertEq(videoReward, rewardPerSecond);
        assertEq(creator, owner);
        assertTrue(isActive);
    }

    function testRecordWatchTime() public {
        // Setup: register user and add video
        vm.prank(user1);
        owatch.registerUser();

        uint256 duration = 300;
        uint256 rewardPerSecond = 1 * 10**18;
        owatch.addVideo(videoId1, duration, rewardPerSecond);

        // Record watch time
        uint256 watchTime = 60; // 1 minute
        vm.prank(user1);
        owatch.recordWatchTime(videoId1, watchTime);

        // Check user stats
        (uint256 totalWatchedTime, uint256 totalEarned, uint256 currentBalance,,) = owatch.getUserStats(user1);

        assertEq(totalWatchedTime, watchTime);
        assertEq(totalEarned, watchTime * rewardPerSecond);
        assertEq(currentBalance, totalEarned);

        // Check video progress
        assertEq(owatch.getUserVideoProgress(user1, videoId1), watchTime);
    }

    function testCannotWatchWithoutRegistration() public {
        uint256 duration = 300;
        uint256 rewardPerSecond = 1 * 10**18;
        owatch.addVideo(videoId1, duration, rewardPerSecond);

        vm.prank(user1);
        vm.expectRevert("User not registered");
        owatch.recordWatchTime(videoId1, 60);
    }

    function testCannotWatchInactiveVideo() public {
        vm.prank(user1);
        owatch.registerUser();

        uint256 duration = 300;
        uint256 rewardPerSecond = 1 * 10**18;
        owatch.addVideo(videoId1, duration, rewardPerSecond);

        // Deactivate video
        owatch.setVideoActive(videoId1, false);

        vm.prank(user1);
        vm.expectRevert("Video not active");
        owatch.recordWatchTime(videoId1, 60);
    }

    function testWatchTimeTooShort() public {
        vm.prank(user1);
        owatch.registerUser();

        uint256 duration = 300;
        uint256 rewardPerSecond = 1 * 10**18;
        owatch.addVideo(videoId1, duration, rewardPerSecond);

        vm.prank(user1);
        vm.expectRevert("Watch time too short");
        owatch.recordWatchTime(videoId1, 10); // Less than MIN_WATCH_TIME (30 seconds)
    }

    function testUpdateVideoReward() public {
        uint256 duration = 300;
        uint256 rewardPerSecond = 1 * 10**18;
        owatch.addVideo(videoId1, duration, rewardPerSecond);

        uint256 newReward = 2 * 10**18;
        owatch.updateVideoReward(videoId1, newReward);

        (, uint256 updatedReward,,) = owatch.getVideoInfo(videoId1);
        assertEq(updatedReward, newReward);
    }

    function testOnlyOwnerCanAddVideo() public {
        uint256 duration = 300;
        uint256 rewardPerSecond = 1 * 10**18;

        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        owatch.addVideo(videoId1, duration, rewardPerSecond);
    }

    function testTokenTransfer() public {
        uint256 transferAmount = 100 * 10**18;

        owatch.transfer(user1, transferAmount);

        assertEq(owatch.balanceOf(user1), transferAmount);
        assertEq(owatch.balanceOf(owner), (1_000_000 * 10**18) - transferAmount);
    }
}
