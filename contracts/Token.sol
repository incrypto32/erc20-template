//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20Burnable, Ownable {
    constructor() ERC20("1S218PA0031A", "1S218PA0031A") Ownable() {
        _mint(msg.sender, 21000000 * 10**8);
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }


}
