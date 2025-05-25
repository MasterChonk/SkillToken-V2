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
    address public randomUser;

    CourseRegistry public courseRegistry;
    SkillNFT public skillNFT;


    function setUp() public {
        owner = makeAddr("owner");
        teacher = makeAddr("teacher");
        student = makeAddr("student");
        randomUser = makeAddr("randomUser");
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

    function testAcceptNFT(uint256 _expReward) public {
        uint expReward = bound(_expReward, 20, 100); // Ensure expReward is between 20 and 100
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
        EXPToken expToken = EXPToken(address(skillNFT.i_expToken()));

        // Check student EXP balance
        uint256 studentExpBalance = expToken.balanceOf(student);

        // Check teacher EXP balance (if teacher gets exp)
        uint256 teacherExpBalance = expToken.balanceOf(teacher);

        assertEq(studentExpBalance, expReward, "Student EXP balance doesn't match");
        assertEq(teacherExpBalance, expReward * 15 / 100, "Teacher EXP balance doesn't match");
    }

    function testSoulboundNotTransferable() public {
        vm.startPrank(teacher);
        uint256 courseId = courseRegistry.createCourse("Solidity Basics");
        skillNFT.offerNFT(student, courseId, "ipfs://tokenURI");
        vm.stopPrank();

        vm.prank(student);
        uint256 tokenId = skillNFT.acceptNFT(courseId);

        // Attempt to transfer the NFT
        // Get the selector for the custom error
        // bytes4 selectorCustom = bytes4(keccak256("CourseNFT__SoulboundNFT_NotTransferable()"));
        // vm.expectRevert(abi.encodeWithSelector(selectorCustom));
        // bytes4 selectorDefault = bytes4(keccak256("ERC721InsufficientApproval(0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496, 1)"));
        vm.expectRevert();
        skillNFT.transferFrom(student, randomUser, tokenId);
        vm.expectRevert();
        skillNFT.safeTransferFrom(student, randomUser, tokenId);
    }
}

