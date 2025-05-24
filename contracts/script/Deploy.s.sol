// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SkillToken.sol";

/**
 * @title Deploy Script
 * @dev Script to deploy SkillToken contract
 */
contract DeployScript is Script {
    SkillToken public skillToken;

    function run() external {
        // Get the deployer's private key from environment
        uint256 deployerPrivateKey = vm.envUint("ANVIL_PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy SkillToken contract
        skillToken = new SkillToken();
        
        // Log deployment information
        console.log("SkillToken deployed at:", address(skillToken));
        console.log("Deployer address:", vm.addr(deployerPrivateKey));
        
        // Grant roles to test accounts for development
        address teacher1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        address teacher2 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        
        skillToken.grantRole(skillToken.TEACHER_ROLE(), teacher1);
        skillToken.grantRole(skillToken.ISSUER_ROLE(), teacher1);
        skillToken.grantRole(skillToken.TEACHER_ROLE(), teacher2);
        skillToken.grantRole(skillToken.ISSUER_ROLE(), teacher2);
        
        console.log("Granted TEACHER_ROLE and ISSUER_ROLE to:", teacher1);
        console.log("Granted TEACHER_ROLE and ISSUER_ROLE to:", teacher2);
        
        // Create some sample courses for testing
        uint256 course1 = skillToken.registerCourse("Solidity Fundamentals");
        uint256 course2 = skillToken.registerCourse("Smart Contract Security");
        uint256 course3 = skillToken.registerCourse("DeFi Development");
        
        console.log("Created sample courses:");
        console.log("- Course 1 (Solidity Fundamentals):", course1);
        console.log("- Course 2 (Smart Contract Security):", course2);
        console.log("- Course 3 (DeFi Development):", course3);
        
        vm.stopBroadcast();
        
        // Log final information
        console.log("\n=== Deployment Summary ===");
        console.log("Contract Address:", address(skillToken));
        console.log("Network: Local Anvil");
        console.log("Chain ID: 31337");
        console.log("Gas Used: ", tx.gasprice);
        
        console.log("\n=== Next Steps ===");
        console.log("1. Update your frontend config with contract address:");
        console.log("   SKILLTOKEN_CONTRACT_ADDRESS=", address(skillToken));
        console.log("2. Import test accounts into MetaMask");
        console.log("3. Start your frontend application");
        
        console.log("\n=== Test Accounts ===");
        console.log("Admin/Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
        console.log("Teacher 1:      0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
        console.log("Teacher 2:      0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
    }
}