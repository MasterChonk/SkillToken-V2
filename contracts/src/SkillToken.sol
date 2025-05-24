// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SkillToken
 * @dev NFT-based skill certification platform
 * @author SkillToken Team
 */
contract SkillToken is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    // Roles
    bytes32 public constant TEACHER_ROLE = keccak256("TEACHER_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    // Token counter
    Counters.Counter private _tokenIdCounter;

    // Structs
    struct Course {
        string name;
        address owner;
        bool active;
        uint256 createdAt;
    }

    struct Certificate {
        address student;
        uint256 courseId;
        string filecoinHash;
        address issuer;
        uint256 issuedAt;
        bool validated;
    }

    // Mappings
    mapping(uint256 => Course) public courses;
    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public studentCertificates;
    mapping(address => uint256[]) public teacherCourses;
    
    // Course counter
    Counters.Counter private _courseIdCounter;

    // Events
    event CourseRegistered(uint256 indexed courseId, string name, address indexed owner);
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed student,
        uint256 indexed courseId,
        address issuer,
        string filecoinHash
    );
    event CertificateValidated(
        uint256 indexed tokenId,
        address indexed validator,
        address indexed student,
        uint256 courseId
    );
    event IssuerDelegated(address indexed issuer, address indexed delegatedBy);

    constructor() ERC721("SkillToken", "SKILL") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(TEACHER_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
    }

    /**
     * @dev Register a new course
     * @param name Course name
     * @return courseId The ID of the created course
     */
    function registerCourse(string memory name) external onlyRole(TEACHER_ROLE) returns (uint256) {
        require(bytes(name).length > 0, "Course name cannot be empty");
        
        _courseIdCounter.increment();
        uint256 courseId = _courseIdCounter.current();
        
        courses[courseId] = Course({
            name: name,
            owner: msg.sender,
            active: true,
            createdAt: block.timestamp
        });
        
        teacherCourses[msg.sender].push(courseId);
        
        emit CourseRegistered(courseId, name, msg.sender);
        return courseId;
    }

    /**
     * @dev Issue a certificate as NFT
     * @param student The student's address
     * @param courseId The course ID
     * @param filecoinHash The Filecoin hash of the certificate
     * @param tokenURI The metadata URI for the NFT
     * @return tokenId The ID of the minted token
     */
    function issueCertificate(
        address student,
        uint256 courseId,
        string memory filecoinHash,
        string memory tokenURI
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(courses[courseId].active, "Course does not exist or is inactive");
        require(bytes(filecoinHash).length > 0, "Filecoin hash cannot be empty");
        
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Mint NFT to student
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store certificate data
        certificates[tokenId] = Certificate({
            student: student,
            courseId: courseId,
            filecoinHash: filecoinHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            validated: false
        });
        
        studentCertificates[student].push(tokenId);
        
        emit CertificateIssued(tokenId, student, courseId, msg.sender, filecoinHash);
        return tokenId;
    }

    /**
     * @dev Delegate issuer role to another address
     * @param issuer The address to grant issuer role
     */
    function delegateIssuer(address issuer) external onlyRole(TEACHER_ROLE) {
        require(issuer != address(0), "Invalid issuer address");
        _grantRole(ISSUER_ROLE, issuer);
        emit IssuerDelegated(issuer, msg.sender);
    }

    /**
     * @dev Validate a certificate
     * @param tokenId The certificate token ID
     */
    function validate(uint256 tokenId) external onlyRole(TEACHER_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        
        Certificate storage cert = certificates[tokenId];
        require(!cert.validated, "Certificate already validated");
        
        cert.validated = true;
        
        emit CertificateValidated(
            tokenId,
            msg.sender,
            cert.student,
            cert.courseId
        );
    }

    /**
     * @dev Check if an address has completed a course
     * @param student The student's address
     * @param courseId The course ID
     * @return hasCompleted Whether the student has a certificate for this course
     */
    function hasCompletedCourse(address student, uint256 courseId) external view returns (bool) {
        uint256[] memory studentTokens = studentCertificates[student];
        
        for (uint256 i = 0; i < studentTokens.length; i++) {
            if (certificates[studentTokens[i]].courseId == courseId) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get student's certificates
     * @param student The student's address
     * @return An array of token IDs owned by the student
     */
    function getStudentCertificates(address student) external view returns (uint256[] memory) {
        return studentCertificates[student];
    }

    /**
     * @dev Get teacher's courses
     * @param teacher The teacher's address
     * @return An array of course IDs created by the teacher
     */
    function getTeacherCourses(address teacher) external view returns (uint256[] memory) {
        return teacherCourses[teacher];
    }

    /**
     * @dev Get certificate details
     * @param tokenId The certificate token ID
     * @return Certificate struct
     */
    function getCertificate(uint256 tokenId) external view returns (Certificate memory) {
        require(_exists(tokenId), "Token does not exist");
        return certificates[tokenId];
    }

    /**
     * @dev Get course details
     * @param courseId The course ID
     * @return Course struct
     */
    function getCourse(uint256 courseId) external view returns (Course memory) {
        require(courseId > 0 && courseId <= _courseIdCounter.current(), "Course does not exist");
        return courses[courseId];
    }

    /**
     * @dev Get total number of certificates issued
     * @return The current token counter value
     */
    function totalCertificates() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Get total number of courses
     * @return The current course counter value
     */
    function totalCourses() external view returns (uint256) {
        return _courseIdCounter.current();
    }

    // Override functions required by Solidity
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}