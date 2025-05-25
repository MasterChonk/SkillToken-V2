// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./CourseRegistry.sol";
import "./EXPToken.sol";

/// @title SkillNFT - NFT certification and EXP system
contract SkillNFT is ERC721URIStorage, Ownable {


    struct PendingNFT {
        address teacher;
        string tokenURI;
        uint256 courseId;
    }


    /*//////////////////////////////////////////////////////////////
                                MAPPINGS
    //////////////////////////////////////////////////////////////*/


    mapping(address => mapping(uint256 => PendingNFT)) public pendingClaims; //student => courseId => PendingNFT
    mapping(address => mapping(uint256 => bool)) public hasClaimed;


    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event NFTOffered(address indexed student, uint256 indexed courseId, address indexed teacher);
    event NFTClaimed(address indexed student, uint256 indexed tokenId, uint256 indexed courseId);


    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error CourseNFT__AlreadyHasPending();
    error CourseNFT__AlreadyClaimed();
    error CourseNFT__NoPendingNFT();
    error CourseNFT__NotTeacher();
    error CourseNFT__SoulboundNFT_NotTransferable();


    
    /*//////////////////////////////////////////////////////////////
                         CONSTANTS / IMMUTABLES
    //////////////////////////////////////////////////////////////*/

    EXPToken public immutable i_expToken;
    CourseRegistry public immutable i_registry;


    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    uint256 private nextTokenId;


    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/


    constructor(address _registry) ERC721("Course Certificate", "COURSE") Ownable(msg.sender){
        i_expToken = new EXPToken();
        i_registry = CourseRegistry(_registry);
        nextTokenId = 1;
    }


    /*//////////////////////////////////////////////////////////////
                         SOULBOUND RESTRICTIONS
    //////////////////////////////////////////////////////////////*/


    // function transferFrom(address from, address to, uint256 tokenId) public virtual override(thisContract) {
    //     revert CourseNFT__SoulboundNFT_NotTransferable();
    // }

    // function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721) {
    //     revert CourseNFT__SoulboundNFT_NotTransferable();
    // }

    // function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override(ERC721) {
    //     revert CourseNFT__SoulboundNFT_NotTransferable();
    // }

    // function approve(address to, uint256 tokenId) public virtual override(ERC721) {
    //     revert CourseNFT__SoulboundNFT_NotTransferable();
    // }

    // function setApprovalForAll(address operator, bool approved) public virtual override(ERC721) {
    //     revert CourseNFT__SoulboundNFT_NotTransferable();
    // }





    function offerNFT(address student, uint256 courseId, string memory tokenURI) external {
        CourseRegistry.Course memory course = i_registry.getCourse(courseId);
        if (msg.sender != course.teacher) revert CourseNFT__NotTeacher();
        if (pendingClaims[student][courseId].teacher != address(0)) revert CourseNFT__AlreadyHasPending();

        pendingClaims[student][courseId] = PendingNFT(course.teacher, tokenURI, courseId);
        emit NFTOffered(student, courseId, course.teacher);
    }

    function acceptNFT(uint256 _courseId) external returns (uint256) {
        PendingNFT memory pending = pendingClaims[msg.sender][_courseId];
        if (pending.teacher == address(0)) revert CourseNFT__NoPendingNFT();
        if (hasClaimed[msg.sender][_courseId]) revert CourseNFT__AlreadyClaimed();

        uint256 tokenId = nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, pending.tokenURI);
        emit NFTClaimed(msg.sender, tokenId, pending.courseId);

        CourseRegistry.Course memory course = i_registry.getCourse(pending.courseId);
        if (course.whitelisted) {
            uint256 studentExp = course.expReward;
            uint256 teacherExp = studentExp * 15 / 100; // 15% of student EXP to teacher
            i_expToken.mint(msg.sender, studentExp);
            i_expToken.mint(course.teacher, teacherExp);
        }

        delete pendingClaims[msg.sender][_courseId]; // Clear the pending claim after acceptance
        return tokenId;
    }
}
