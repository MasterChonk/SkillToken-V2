// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EXPToken - Soulbound ERC20 for EXP
contract EXPToken is ERC20, Ownable {

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event SoulboundTransfer(address indexed from, address indexed to, uint256 amount);


    
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error EXPToken__SoulboundTransferNotAllowed();

    
    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    constructor() ERC20("Experience Points", "EXP") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        if (from != address(0) && to != address(0)) {
            revert EXPToken__SoulboundTransferNotAllowed();
        }
        super._update(from, to, amount);
    }
}