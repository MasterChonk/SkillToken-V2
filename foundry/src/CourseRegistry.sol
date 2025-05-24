//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


/// @title CourseRegistry - Handles course registration and whitelisting
contract CourseRegistry is Ownable {

    struct Course {
        address teacher;
        string name;
        bool whitelisted;
        uint256 expReward;
    }

    constructor() Ownable(msg.sender) {}

    uint256 public courseCounter;
    address public communityVerifier;
    bool public isCommunityVerifierSet;

    mapping(uint256 => Course) public courses;

    event CourseCreated(uint256 indexed courseId, address indexed teacher, string name);
    event CourseWhitelisted(uint256 indexed courseId, uint256 expReward);

    error CourseRegistry__NotCourseTeacher();
    error CourseRegistry__InvalidEXPAmount();
    error CommunityVerifier__AlreadySet();

    function createCourse(string calldata name) external returns (uint256 courseId) {
        courseId = ++courseCounter;
        courses[courseId] = Course(msg.sender, name, false, 0);
        emit CourseCreated(courseId, msg.sender, name);
    }

    function setCommunityVerifier(address _communityVerifier) external onlyOwner {
        if (isCommunityVerifierSet) revert CommunityVerifier__AlreadySet();
        communityVerifier = _communityVerifier;
        isCommunityVerifierSet = true;
    }

    function whitelistCourse(uint256 courseId, uint256 expReward) external {
        if (msg.sender != owner() && msg.sender != courses[courseId].teacher) {
            revert CourseRegistry__NotCourseTeacher();
        }
        if (expReward < 20 || expReward > 100) revert CourseRegistry__InvalidEXPAmount();
        courses[courseId].whitelisted = true;
        courses[courseId].expReward = expReward;
        emit CourseWhitelisted(courseId, expReward);
    }


    function getCourse(uint256 courseId) external view returns (Course memory) {
        return courses[courseId];
    }
}