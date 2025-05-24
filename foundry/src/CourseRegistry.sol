//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";


/// @title CourseRegistry - Handles course registration and whitelisting
contract CourseRegistry is Ownable {

    struct Course {
        address teacher;
        string name;
        uint256 expReward;
        bool whitelisted;
    }

    constructor() Ownable(msg.sender) {}

    uint256 public courseCounter;
    mapping(uint256 => Course) public courses;

    event CourseCreated(uint256 indexed courseId, address indexed teacher, string name);
    event CourseWhitelisted(uint256 indexed courseId, uint256 expReward);

    error CourseRegistry__NotCourseTeacher();
    error CourseRegistry__InvalidEXPAmount();

    function createCourse(string calldata name) external returns (uint256 courseId) {
        courseId = ++courseCounter;
        courses[courseId] = Course(msg.sender, name, 0, false);
        emit CourseCreated(courseId, msg.sender, name);
    }

    function whitelistCourse(uint256 courseId, uint256 expReward) external onlyOwner {
        if (expReward < 20 || expReward > 100) revert CourseRegistry__InvalidEXPAmount();
        courses[courseId].whitelisted = true;
        courses[courseId].expReward = expReward;
        emit CourseWhitelisted(courseId, expReward);
    }

    function getCourse(uint256 courseId) external view returns (Course memory) {
        return courses[courseId];
    }
}