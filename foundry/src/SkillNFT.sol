// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./CourseRegistry.sol";
import "./EXPToken.sol";

/// @title CourseNFT - NFT certification and EXP system
contract CourseNFT is ERC721URIStorage, Ownable {
    EXPToken public expToken;
    CourseRegistry public registry;
    uint256 private _nextTokenId;

    struct PendingNFT {
        address teacher;
        string tokenURI;
        uint256 courseId;
    }

    constructor(address _expToken, address _registry) ERC721("Course Certificate", "COURSE") Ownable(msg.sender) {
        expToken = EXPToken(_expToken);
        registry = CourseRegistry(_registry);
        _nextTokenId = 1;
    }

    mapping(address => mapping(uint256 => PendingNFT)) public pendingClaims; //student => courseId => PendingNFT
    mapping(address => mapping(uint256 => bool)) public hasClaimed;

    event NFTOffered(address indexed student, uint256 indexed courseId, address indexed teacher);
    event NFTClaimed(address indexed student, uint256 indexed tokenId, uint256 indexed courseId);

    error CourseNFT__AlreadyHasPending();
    error CourseNFT__AlreadyClaimed();
    error CourseNFT__NoPendingNFT();
    error CourseNFT__NotTeacher();


    function offerNFT(address student, uint256 courseId, string memory tokenURI) external {
        CourseRegistry.Course memory course = registry.getCourse(courseId);
        if (msg.sender != course.teacher) revert CourseNFT__NotTeacher();
        if (pendingClaims[student][courseId].teacher != address(0)) revert CourseNFT__AlreadyHasPending();

        pendingClaims[student][courseId] = PendingNFT(course.teacher, tokenURI, courseId);
        emit NFTOffered(student, courseId, course.teacher);
    }

    function acceptNFT(uint256 _courseId) external {
        PendingNFT memory pending = pendingClaims[msg.sender][_courseId];
        if (pending.teacher == address(0)) revert CourseNFT__NoPendingNFT();
        if (hasClaimed[msg.sender][_courseId]) revert CourseNFT__AlreadyClaimed();

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, pending.tokenURI);
        emit NFTClaimed(msg.sender, tokenId, pending.courseId);

        CourseRegistry.Course memory course = registry.getCourse(pending.courseId);
        if (course.whitelisted) {
            uint256 studentExp = course.expReward;
            uint256 teacherExp = studentExp / 100 * 15; // 15% of student EXP to teacher
            expToken.mint(msg.sender, studentExp);
            expToken.mint(course.teacher, teacherExp);
        }

        delete pendingClaims[msg.sender][_courseId]; // Clear the pending claim after acceptance
    }
}
