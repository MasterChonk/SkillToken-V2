// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/SkillToken.sol";

contract SkillTokenTest is Test {
    SkillToken public skillToken;
    
    address public admin = address(0x1);
    address public teacher = address(0x2);
    address public student = address(0x3);
    address public issuer = address(0x4);
    
    string constant COURSE_NAME = "Solidity 101";
    string constant FILECOIN_HASH = "QmTest123456789";
    string constant TOKEN_URI = "https://ipfs.io/ipfs/QmTokenMetadata";

    function setUp() public {
        vm.startPrank(admin);
        skillToken = new SkillToken();
        
        // Grant roles
        skillToken.grantRole(skillToken.TEACHER_ROLE(), teacher);
        skillToken.grantRole(skillToken.ISSUER_ROLE(), issuer);
        vm.stopPrank();
    }

    function testDeployment() public {
        assertEq(skillToken.name(), "SkillToken");
        assertEq(skillToken.symbol(), "SKILL");
        assertTrue(skillToken.hasRole(skillToken.DEFAULT_ADMIN_ROLE(), admin));
    }

    function testRegisterCourse() public {
        vm.prank(teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        
        assertEq(courseId, 1);
        
        SkillToken.Course memory course = skillToken.getCourse(courseId);
        assertEq(course.name, COURSE_NAME);
        assertEq(course.owner, teacher);
        assertTrue(course.active);
        assertEq(course.createdAt, block.timestamp);
    }

    function testRegisterCourseOnlyTeacher() public {
        vm.prank(student);
        vm.expectRevert();
        skillToken.registerCourse(COURSE_NAME);
    }

    function testRegisterCourseEmptyName() public {
        vm.prank(teacher);
        vm.expectRevert("Course name cannot be empty");
        skillToken.registerCourse("");
    }

    function testIssueCertificate() public {
        // First register a course
        vm.prank(teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        
        // Issue certificate
        vm.prank(issuer);
        uint256 tokenId = skillToken.issueCertificate(
            student,
            courseId,
            FILECOIN_HASH,
            TOKEN_URI
        );
        
        assertEq(tokenId, 1);
        assertEq(skillToken.ownerOf(tokenId), student);
        assertEq(skillToken.tokenURI(tokenId), TOKEN_URI);
        
        SkillToken.Certificate memory cert = skillToken.getCertificate(tokenId);
        assertEq(cert.student, student);
        assertEq(cert.courseId, courseId);
        assertEq(cert.filecoinHash, FILECOIN_HASH);
        assertEq(cert.issuer, issuer);
        assertFalse(cert.validated);
    }

    function testIssueCertificateOnlyIssuer() public {
        vm.prank(teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        
        vm.prank(student);
        vm.expectRevert();
        skillToken.issueCertificate(student, courseId, FILECOIN_HASH, TOKEN_URI);
    }

    function testIssueCertificateInvalidCourse() public {
        vm.prank(issuer);
        vm.expectRevert("Course does not exist or is inactive");
        skillToken.issueCertificate(student, 999, FILECOIN_HASH, TOKEN_URI);
    }

    function testValidateCertificate() public {
        // Setup: register course and issue certificate
        vm.prank(teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        
        vm.prank(issuer);
        uint256 tokenId = skillToken.issueCertificate(
            student,
            courseId,
            FILECOIN_HASH,
            TOKEN_URI
        );
        
        // Validate certificate
        vm.prank(teacher);
        skillToken.validate(tokenId);
        
        SkillToken.Certificate memory cert = skillToken.getCertificate(tokenId);
        assertTrue(cert.validated);
    }

    function testValidateOnlyTeacher() public {
        vm.prank(teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        
        vm.prank(issuer);
        uint256 tokenId = skillToken.issueCertificate(
            student,
            courseId,
            FILECOIN_HASH,
            TOKEN_URI
        );
        
        vm.prank(student);
        vm.expectRevert();
        skillToken.validate(tokenId);
    }

    function testDelegateIssuer() public {
        address newIssuer = address(0x5);
        
        vm.prank(teacher);
        skillToken.delegateIssuer(newIssuer);
        
        assertTrue(skillToken.hasRole(skillToken.ISSUER_ROLE(), newIssuer));
    }

    function testHasCompletedCourse() public {
        vm.prank(teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        
        // Initially false
        assertFalse(skillToken.hasCompletedCourse(student, courseId));
        
        // Issue certificate
        vm.prank(issuer);
        skillToken.issueCertificate(student, courseId, FILECOIN_HASH, TOKEN_URI);
        
        // Now true
        assertTrue(skillToken.hasCompletedCourse(student, courseId));
    }

    function testGetStudentCertificates() public {
        vm.prank(teacher);
        uint256 courseId1 = skillToken.registerCourse("Course 1");
        uint256 courseId2 = skillToken.registerCourse("Course 2");
        
        vm.startPrank(issuer);
        uint256 tokenId1 = skillToken.issueCertificate(
            student,
            courseId1,
            "hash1",
            "uri1"
        );
        uint256 tokenId2 = skillToken.issueCertificate(
            student,
            courseId2,
            "hash2",
            "uri2"
        );
        vm.stopPrank();
        
        uint256[] memory studentCerts = skillToken.getStudentCertificates(student);
        assertEq(studentCerts.length, 2);
        assertEq(studentCerts[0], tokenId1);
        assertEq(studentCerts[1], tokenId2);
    }

    function testGetTeacherCourses() public {
        vm.startPrank(teacher);
        uint256 courseId1 = skillToken.registerCourse("Course 1");
        uint256 courseId2 = skillToken.registerCourse("Course 2");
        vm.stopPrank();
        
        uint256[] memory teacherCourses = skillToken.getTeacherCourses(teacher);
        assertEq(teacherCourses.length, 2);
        assertEq(teacherCourses[0], courseId1);
        assertEq(teacherCourses[1], courseId2);
    }

    function testTotalCounters() public {
        assertEq(skillToken.totalCertificates(), 0);
        assertEq(skillToken.totalCourses(), 0);
        
        vm.prank(teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        assertEq(skillToken.totalCourses(), 1);
        
        vm.prank(issuer);
        skillToken.issueCertificate(student, courseId, FILECOIN_HASH, TOKEN_URI);
        assertEq(skillToken.totalCertificates(), 1);
    }

    function testMultipleCoursesAndCertificates() public {
        // Create multiple courses
        vm.startPrank(teacher);
        uint256 course1 = skillToken.registerCourse("Solidity Basics");
        uint256 course2 = skillToken.registerCourse("Smart Contract Security");
        uint256 course3 = skillToken.registerCourse("DeFi Development");
        vm.stopPrank();
        
        // Issue certificates to different students
        address student2 = address(0x6);
        address student3 = address(0x7);
        
        vm.startPrank(issuer);
        skillToken.issueCertificate(student, course1, "hash1", "uri1");
        skillToken.issueCertificate(student2, course1, "hash2", "uri2");
        skillToken.issueCertificate(student2, course2, "hash3", "uri3");
        skillToken.issueCertificate(student3, course3, "hash4", "uri4");
        vm.stopPrank();
        
        // Verify totals
        assertEq(skillToken.totalCourses(), 3);
        assertEq(skillToken.totalCertificates(), 4);
        
        // Verify student certificates
        assertEq(skillToken.getStudentCertificates(student).length, 1);
        assertEq(skillToken.getStudentCertificates(student2).length, 2);
        assertEq(skillToken.getStudentCertificates(student3).length, 1);
        
        // Verify course completions
        assertTrue(skillToken.hasCompletedCourse(student, course1));
        assertFalse(skillToken.hasCompletedCourse(student, course2));
        assertTrue(skillToken.hasCompletedCourse(student2, course1));
        assertTrue(skillToken.hasCompletedCourse(student2, course2));
    }

    function testEventEmissions() public {
        // Test CourseRegistered event
        vm.prank(teacher);
        vm.expectEmit(true, true, true, true);
        emit SkillToken.CourseRegistered(1, COURSE_NAME, teacher);
        uint256 courseId = skillToken.registerCourse(COURSE_NAME);
        
        // Test CertificateIssued event
        vm.prank(issuer);
        vm.expectEmit(true, true, true, true);
        emit SkillToken.CertificateIssued(1, student, courseId, issuer, FILECOIN_HASH);
        uint256 tokenId = skillToken.issueCertificate(student, courseId, FILECOIN_HASH, TOKEN_URI);
        
        // Test CertificateValidated event
        vm.prank(teacher);
        vm.expectEmit(true, true, true, true);
        emit SkillToken.CertificateValidated(tokenId, teacher, student, courseId);
        skillToken.validate(tokenId);
        
        // Test IssuerDelegated event
        address newIssuer = address(0x8);
        vm.prank(teacher);
        vm.expectEmit(true, true, true, true);
        emit SkillToken.IssuerDelegated(newIssuer, teacher);
        skillToken.delegateIssuer(newIssuer);
    }
}