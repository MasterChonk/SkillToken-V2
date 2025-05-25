// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ExpToken.sol";
import "./CourseRegistry.sol";

/// @title CourseVerificationCommunityVerifier - EXP-based voting to verify courses
contract CourseVerificationCommunityVerifier is Ownable {

    struct Vote {
        bool support;
        uint256 weight; // EXP used to vote
    }

    struct VotingSession {
        uint256 startTime;
        bool finalized;
        uint256 expForCompletion;
        uint256 totalSupport;
        uint256 totalAgainst;
        uint256 totalVoters;
        uint256 totalExp;
        mapping(address => bool) hasVoted;
        mapping(address => Vote) votes;
    }

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/


    modifier onlyDuringVoting(uint256 courseId) {
        VotingSession storage session = votingSessions[courseId];
        if (block.timestamp < session.startTime + VOTING_DURATION) revert CommunityVerifier__VotingFinalized();
        if (session.finalized) revert CommunityVerifier__VotingFinalized();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                MAPPINGS
    //////////////////////////////////////////////////////////////*/

    mapping(uint256 => VotingSession) public votingSessions; // courseId => proposal


    /*//////////////////////////////////////////////////////////////
                         CONSTANTS / IMMUTABLES
    //////////////////////////////////////////////////////////////*/

    uint256 public constant VOTING_DURATION = 14 days;
    uint256 public constant MIN_TOTAL_EXP = 2000;
    uint256 public constant MIN_VOTERS = 100;
    uint256 public constant APPROVAL_THRESHOLD = 70; // 70% approval required
    EXPToken public immutable i_expToken;
    CourseRegistry public immutable i_courseRegistry;


    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event Voted(address indexed voter, uint256 indexed courseId, bool support, uint256 weight);
    event CourseVerified(uint256 indexed);
    event VerificationProposed(uint256 indexed, address indexed);


    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error CommunityVerifier__AlreadyVoted();
    error CommunityVerifier__InsufficientEXP();
    error CommunityVerifier__CourseAlreadyWhitelisted();
    error CommunityVerifier__VotingFinalized();
    error CommunityVerifier__CourseDoesNotExist();
    error CommunityVerifier__ProposalAlreadyExists();
    error CommunityVerifier__VotingStillActive();
    error CommunityVerifier__InvalidEXPAmount();


    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/


    constructor(address _expToken, address _courseRegistry) Ownable(msg.sender) {
        i_expToken = EXPToken(_expToken);
        i_courseRegistry = CourseRegistry(_courseRegistry);
    }


    function proposeCourseVerification(uint256 _courseId, uint256 _exp) external {
        if (_exp < 20 || _exp > 100) revert CommunityVerifier__InvalidEXPAmount();
        votingSessions[_courseId].expForCompletion = _exp;
        CourseRegistry.Course memory course = i_courseRegistry.getCourse(_courseId);
        if (course.teacher == address(0)) revert CommunityVerifier__CourseDoesNotExist();
        if (course.whitelisted) revert CommunityVerifier__CourseAlreadyWhitelisted();
        if (votingSessions[_courseId].startTime != 0) revert CommunityVerifier__ProposalAlreadyExists();

        VotingSession storage session = votingSessions[_courseId];
        session.startTime = block.timestamp;
        session.finalized = false;

        emit VerificationProposed(_courseId, msg.sender);
    }

    /// @notice Allows users to vote for or against course verification
    /// @param courseId The course to vote on
    /// @param support True = approve, False = reject
    function vote(uint256 courseId, bool support) external onlyDuringVoting(courseId) {
        CourseRegistry.Course memory course = i_courseRegistry.getCourse(courseId);
        if (course.whitelisted) revert CommunityVerifier__CourseAlreadyWhitelisted();

        VotingSession storage session = votingSessions[courseId];
        if (session.hasVoted[msg.sender]) revert CommunityVerifier__AlreadyVoted();

        uint256 balance = i_expToken.balanceOf(msg.sender);
        if (balance == 0) revert CommunityVerifier__InsufficientEXP();

        session.hasVoted[msg.sender] = true;
        session.votes[msg.sender] = Vote(support, balance);
        session.totalVoters++;
        session.totalExp += balance;

        if (support) {
            session.totalSupport += balance;
        } else {
            session.totalAgainst += balance;
        }

        emit Voted(msg.sender, courseId, support, balance);
    }

    /// @notice Finalizes the vote, verifies the course if requirements are met
    /// @param _courseId The course to finalize voting for
    function finalizeVoting(uint256 _courseId) external {
        VotingSession storage session = votingSessions[_courseId];

        if (block.timestamp > session.startTime + VOTING_DURATION) revert CommunityVerifier__VotingStillActive();
        if (session.finalized) revert CommunityVerifier__VotingFinalized();
        session.finalized = true;

        if (
            session.totalVoters >= MIN_VOTERS &&
            session.totalExp >= MIN_TOTAL_EXP
        ) {
            uint256 supportPercent = (session.totalSupport * 100) / session.totalExp;
            uint256 expReward = session.expForCompletion;
            if (supportPercent >= APPROVAL_THRESHOLD) {
                i_courseRegistry.whitelistCourse(_courseId, expReward);
                emit CourseVerified(_courseId);
            }
        }
    }


    /// @notice Returns basic voting stats for a course
    function getSession(uint256 courseId)
        external
        view
        returns (uint256 voters, uint256 exp, uint256 support, uint256 against)
    {
        VotingSession storage session = votingSessions[courseId];
        return (
            session.totalVoters,
            session.totalExp,
            session.totalSupport,
            session.totalAgainst
        );
    }
}