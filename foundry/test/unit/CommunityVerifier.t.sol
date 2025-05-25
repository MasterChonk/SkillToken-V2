//SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {CourseVerificationCommunityVerifier} from "../../src/CommunityVerifier.sol";
import {EXPToken} from "../../src/ExpToken.sol";
import {CourseRegistry} from "../../src/CourseRegistry.sol";


contract CommunityVerifierTest is Test {
    address public owner;
    address public teacher;
    address public student;
    address public randomUser;

    CourseVerificationCommunityVerifier public verifier;
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
        verifier = new CourseVerificationCommunityVerifier(address(expToken), address(courseRegistry));
        vm.stopPrank();
    }

    function testProposeVerification() public {
        vm.startPrank(teacher);
        uint256 courseId = courseRegistry.createCourse("Solidity Basics");
        vm.prank(owner);
        courseRegistry.whitelistCourse(courseId, 50);
        
        vm.stopPrank();
        verifier.proposeVerification(courseId);
        
        (uint256 startTime, bool finalized, uint256 expForCompletion, uint256 totalSupport, uint256 totalAgainst, uint256 totalVoters, uint256 totalExp) = verifier.votingSessions(courseId);
        assertEq(startTime > 0, true, "Voting session should have started");
        assertEq(finalized, false, "Voting session should not be finalized");
    }
}