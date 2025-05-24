//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ERC721.sol";
import "./ERC721Enumerable.sol";
import "./ERC721URIStorage.sol";
contract MyToken is ERC721, ERC721Enumerable, ERC721URIStorage {
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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal pure override returns(string memory) {
        return "ipfs://";
    }

    // function _burn(uint tokenId) internal override(ERC721, ERC721URIStorage) {
    //     super._burn(tokenId);
    // }

    function tokenURI(
        uint tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    function getHash(string memory input) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(input));
    }
    event OrganizationRegistered(address indexed orgAddress, string name);
    mapping (address => bytes32) public Organizations;
    mapping (bytes32 => address) public Ministers;
    mapping (bytes32 => mapping(bytes32 => bool)) public Sertificates;
    function createOrganization (string memory _name) external {
        require(Organizations[msg.sender] == bytes32(0), "Already registed");
        require(msg.sender != Ministers[getHash(_name)], "Minister only can have one organization");
        Organizations[msg.sender] = getHash(_name);
        Ministers[Organizations[msg.sender]] = msg.sender;
        emit OrganizationRegistered(msg.sender, _name);
    }
    modifier _onlyMinister(address minister) {
        require(minister == Ministers[Organizations[msg.sender]], "Only minister can use function");
        _;
    }
    // function giveAcccess(address _to, string memory _sertName) external _onlyMinister(msg.sender){
    //     require(Sertificates[getHash(Organizations[msg.sender])][getHash(_sertName)] != bytes32(0), "Sertificate doesnt exist ");
    // }

}