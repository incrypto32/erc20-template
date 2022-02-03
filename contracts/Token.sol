//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Token is ERC20Burnable, ERC20Pausable, Ownable {
    using SafeMath for uint256;

    address public taxWallet = 0x48D825Cd5949ab9a2Fc47122EDB7b93F2828C3E3;
    uint256 public txnCount;
    uint256[7] public taxRates;
    mapping(address => bool) _blacklist;

    event BlacklistUpdated(address indexed user, bool value);

    constructor() ERC20("LEALS", "LEAL") Ownable() {
        _mint(msg.sender, 21000000000 * 10**18);
        taxRates = [500, 400, 300, 200, 100, 50, 10];
    }

    function updateBlacklist(address user, bool value)
        public
        virtual
        onlyOwner
    {
        _blacklist[user] = value;
        emit BlacklistUpdated(user, value);
    }

    function isBlackListed(address user) public view returns (bool) {
        return _blacklist[user];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Pausable) {
        require(
            !isBlackListed(to),
            "Token transfer refused. Receiver is on blacklist"
        );
        require(
            !isBlackListed(from),
            "Token transfer refused. Receiver is on blacklist"
        );

        ERC20Pausable._beforeTokenTransfer(from, to, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        uint256 taxRate;
        txnCount++;
        if (txnCount <= 5) {
            taxRate = taxRates[0];
        } else if (txnCount <= 10) {
            taxRate = taxRates[1];
        } else if (txnCount <= 15) {
            taxRate = taxRates[2];
        } else if (txnCount <= 20) {
            taxRate = taxRates[3];
        } else if (txnCount <= 25) {
            taxRate = taxRates[4];
        } else if (txnCount <= 30) {
            taxRate = taxRates[5];
        } else {
            taxRate = taxRates[6];
        }

        uint256 amountAfterTax = amount.mul(10000 - taxRate).div(10000);
        super._transfer(sender, taxWallet, amount - amountAfterTax);
        super._transfer(sender, recipient, amountAfterTax);
    }

    function updateTaxRates(uint256[7] calldata rates)
        public
        virtual
        onlyOwner
    {
        taxRates = rates;
    }

    function updateTaxWallet(address wallet) public virtual onlyOwner {
        taxWallet = wallet;
    }

    function withdrawTokens(address to, uint256 amount) public onlyOwner {
        _transfer(address(this), to, amount);
    }

    function burnTokens(uint256 amount) public onlyOwner {
        _burn(address(this), amount);
    }

    function pause() public onlyOwner {
        _pause();
    }
}
