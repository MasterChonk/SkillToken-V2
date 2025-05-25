//SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {CommunityVerifier} from "../../src/CommunityVerifier.sol";
import {SkillNFT} from "../../src/SkillNFT.sol";
import {EXPToken} from "../../src/ExpToken.sol";
import {CourseRegistry} from "../../src/CourseRegistry.sol";


contract CommunityVerifierTest is Test {
    address public owner;
    address public teacher;
    address public student;
    address public randomUser;

    CommunityVerifier public verifier;
    SkillNFT public skillNFT;
    EXPToken public expToken;
    CourseRegistry public courseRegistry;

    function setUp() public {
        owner = makeAddr("owner");
        teacher = makeAddr("teacher");
        student = makeAddr("student");
        randomUser = makeAddr("randomUser");

        vm.startPrank(owner);
        courseRegistry = new CourseRegistry();
        expToken = new EXPToken();       
        verifier = new CommunityVerifier(address(expToken), address(courseRegistry));
        vm.stopPrank();
    }

    function testProposeVerification() public {
        vm.prank(teacher);
        uint256 courseId = courseRegistry.createCourse("Solidity Basics");
        vm.stopPrank();
        vm.prank(randomUser);
        verifier.proposeCourseVerification(courseId, 50);
        
        (uint256 startTime, bool finalized, uint256 expForCompletion, uint256 totalSupport, uint256 totalAgainst, uint256 totalVoters, uint256 totalExp) = verifier.votingSessions(courseId);
        assertEq(startTime > 0, true, "Voting session should have started");
        assertEq(finalized, false, "Voting session should not be finalized");
    }


    function testVoteForCourse() public {
        // Whitelist a course and give 50 students some EXP to vote
        vm.prank(teacher);
        uint256 courseId = courseRegistry.createCourse("Solidity Basics");
        vm.startPrank(owner);

        for (uint256 i = 0; i < 50; i++) {
            address studentAddress = vm.addr(i + 1); // Create 50 unique student addresses
            expToken.mint(studentAddress, 300); // Mint 100 EXP tokens to each student
        }
        vm.stopPrank();
        vm.prank(randomUser);
        verifier.proposeCourseVerification(courseId, 100); // Propose verification with 100 EXP for completion

        for (uint256 i = 0; i < 40; i++) {
            address studentAddress = vm.addr(i + 1);
            vm.startPrank(studentAddress);
            verifier.vote(courseId, true);
            vm.stopPrank();
        }
        for (uint256 i = 40; i < 50; i++) {
            address studentAddress = vm.addr(i + 1);
            vm.startPrank(studentAddress);
            verifier.vote(courseId, false);
            vm.stopPrank();
        }
        (uint256 startTime, bool finalized, uint256 expForCompletion, uint256 totalSupport, uint256 totalAgainst, uint256 totalVoters, uint256 totalExp) = verifier.votingSessions(courseId);
        assertEq(totalSupport, 12000, "Total support votes should be 4000");
        assertEq(totalAgainst, 3000, "Total against votes should be 3000");
        assertEq(totalVoters, 50, "Total voters should be 50");
        assertEq(totalExp, 15000, "Total EXP should be 5000");
        assertEq(expForCompletion, 100, "EXP for completion should be 100");

        // vm.warp(startTime + 15 days); // Move time forward to finalize voting

        // //check the finalized state
        // assertEq(verifier.votingSessions(courseId).finalized, true, "Voting session should be finalized");
    }
}