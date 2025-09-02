// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/OWATCH.sol";

contract DeployOWATCH is Script {
    function run() external {
        // Load private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy OWATCH contract with initial supply of 1,000,000 tokens
        OWATCH owatch = new OWATCH(1_000_000);

        console.log("OWATCH deployed to:", address(owatch));
        console.log("Initial supply:", owatch.totalSupply() / 10**18, "OWATCH");

        vm.stopBroadcast();
    }
}
