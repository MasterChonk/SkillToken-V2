//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "./ERC721URIStorage.sol";
contract MyToken is ERC721, ERC721URIStorage {
    address public owner;
    uint currentTokenId;

    constructor() ERC721("MyToken", "MTK") {
        owner = msg.sender;
    }
    // реалызувати сам мінтинг
    function safeMint(address to, string calldata tokenId) internal {
        // require(owner == msg.sender, "not an owner!");

        _safeMint(to, currentTokenId);
        _setTokenURI(currentTokenId, tokenId);

        currentTokenId++;
    }

    // function supportsInterface(bytes4 interfaceId)
    //     public
    //     view
    //     override(ERC721, ERC721Enumerable)
    //     returns (bool)
    // {
    //     return super.supportsInterface(interfaceId);
    // }
    //якщо треба префікс
    // function _baseURI() internal pure override returns(string memory) {
    //     return "";
    // }

    // function _burn(uint tokenId) internal override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    // }

    function tokenURI(
        uint tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // function _beforeTokenTransfer(address from, address to, uint tokenId) internal override(ERC721, ERC721Enumerable) {
    //     super._beforeTokenTransfer(from, to, tokenId);
    // }
    function getHash(string memory input) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(input));
    }
    event teacherRegister(address indexed teacherAddress, string name);
    event courses(address indexed teacher, bytes32 id, string name, string urlCourseImage);
    mapping (address => mapping(bytes32 => bool)) public Courses;
    mapping (address => bool) TeacherExist;
    mapping (bytes32 => address) public Teachers;
    function registerAsTeacher (string memory _name) external {
        require(TeacherExist[msg.sender] == false, "Already registed");
        TeacherExist[msg.sender] = true;
        emit teacherRegister(msg.sender, _name);
    }
    modifier _onlyTeacher(address teacher) {
        require(TeacherExist[teacher], "Only teacher");
        _;
    }
    function createCourse(string memory _name, string memory urlCourseImage) external _onlyTeacher(msg.sender){ 
        require(Teachers[getHash(_name)] == address(0), "Course already exist");
        Courses[msg.sender][getHash(_name)] = true;
        Teachers[getHash(_name)] = msg.sender;
        emit courses(msg.sender, getHash(_name), _name, urlCourseImage);
    }

    uint256 private _tokenIdCounter = 0;

    function MysafeMint(address to) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function createNFT(string memory uri) internal {
        uint256 tokenId = MysafeMint(msg.sender);
        _setTokenURI(tokenId, uri);
    }

    function createCert(string memory _name, address _student, string memory uri) external _onlyTeacher(msg.sender){
        require(Teachers[getHash(_name)] == msg.sender, "Dont have access for this course");
        createNFT(uri);
    }

    function Verify(address student, uint256 id) external view returns(bool){
        if (!_exists(id)) {
            return false;
        }

        return ownerOf(id) == student;
    }
    // function giveAcccess(address _to, string memory _sertName) external _onlyMinister(msg.sender){
    //     require(Sertificates[getHash(Organizations[msg.sender])][getHash(_sertName)] != bytes32(0), "Sertificate doesnt exist ");
    // }

}