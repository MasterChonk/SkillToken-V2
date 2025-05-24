//SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SkillNFT} from "../../src/SkillNFT.sol";
import {CourseRegistry} from "../../src/CourseRegistry.sol";
import {EXPToken} from "../../src/ExpToken.sol";

contract SkillNFTTest is Test {

    address public owner;
    address public teacher;
    address public student;

    CourseRegistry public courseRegistry;
    SkillNFT public skillNFT;


    function setUp() public {
        owner = makeAddr("owner");
        teacher = makeAddr("teacher");
        student = makeAddr("student");
        vm.startPrank(owner);
        courseRegistry = new CourseRegistry();
        skillNFT = new SkillNFT(address(courseRegistry));
        vm.stopPrank();
    }

    function testOfferNFT() public {
        vm.prank(teacher);
        uint256 courseId = courseRegistry.createCourse("Solidity Basics");
        vm.prank(owner);
        courseRegistry.whitelistCourse(courseId, 50);
        vm.prank(teacher);
        skillNFT.offerNFT(student, courseId, "ipfs://tokenURI");

        (address storedTeacher, string memory storedTokenURI, uint256 storedCourseId) = skillNFT.pendingClaims(student, courseId);
        assertEq(storedTeacher, teacher, "Teacher address doesn't match");
        assertEq(storedCourseId, courseId, "Course ID doesn't match");
        assertEq(storedTokenURI, "ipfs://tokenURI", "Token URI doesn't match");
    }

    function testAcceptNFT() public {
        uint256 expReward = 50;
        vm.prank(teacher);
        uint256 courseId = courseRegistry.createCourse("Solidity Basics");
        vm.prank(owner);
        courseRegistry.whitelistCourse(courseId, expReward);
        vm.prank(teacher);
        skillNFT.offerNFT(student, courseId, "ipfs://tokenURI");

        vm.prank(student);
        uint256 tokenId = skillNFT.acceptNFT(courseId);

        assertEq(skillNFT.ownerOf(tokenId), student, "Student is not the owner of the NFT");
        assertEq(skillNFT.tokenURI(tokenId), "ipfs://tokenURI", "Token URI doesn't match");


        // Access the deployed EXPToken instance through skillNFT
        EXPToken expToken = EXPToken(address(skillNFT.expToken()));

        // Check student EXP balance
        uint256 studentExpBalance = expToken.balanceOf(student);

        // Check teacher EXP balance (if teacher gets exp)
        uint256 teacherExpBalance = expToken.balanceOf(teacher);

        assertEq(studentExpBalance, expReward, "Student EXP balance doesn't match");
        assertEq(teacherExpBalance, expReward * 15 / 100, "Teacher EXP balance doesn't match");
    }
}

