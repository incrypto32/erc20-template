//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20Burnable, Ownable {
    constructor() ERC20("Metro Coin", "MTR") Ownable() {
        _mint(msg.sender, 10000000000 * 10**18);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }


}
