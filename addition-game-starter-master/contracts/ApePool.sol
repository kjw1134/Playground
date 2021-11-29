pragma solidity ^0.5.6;

import "./klaytn-contracts/math/SafeMath.sol";
import "./interfaces/IApePool.sol";
import "./interfaces/IApe.sol";

contract ApePool is IApePool {
    using SafeMath for uint256;

    IApe public ape;

    constructor(IApe _ape) public {
        ape = _ape;
    }

    function () payable external {}

    function swapToAPE() external payable {
        uint256 newKlay = address(this).balance;
        uint256 lastAPE= ape.balanceOf(address(this));

        uint256 newAPE = (newKlay.sub(msg.value)).mul(lastAPE).div(newKlay);

        ape.transfer(msg.sender, lastAPE.sub(newAPE));

        emit SwapToAPE(msg.sender, msg.value);
    }

    function swapToKlay(uint256 amount) external {
        uint256 lastKlay = address(this).balance;
        uint256 lastAPE = ape.balanceOf(address(this));

        uint256 newKlay = lastAPE.mul(lastKlay).div(lastAPE.add(amount.mul(9).div(10)));

        ape.transferFrom(msg.sender, address(this), amount);
        msg.sender.transfer(lastKlay.sub(newKlay));

        emit SwapToKlay(msg.sender, amount);
    }

    function addLiquidity() external payable {
        uint256 lastKlay = (address(this).balance).sub(msg.value);
        uint256 lastAPE = ape.balanceOf(address(this));

        uint256 inputAPE = lastAPE.mul(msg.value).div(lastKlay);
        if(ape.excluded(msg.sender)) {
           ape.transferFrom(msg.sender, address(this), inputAPE);
        } else {
            ape.transferFrom(msg.sender, address(this), inputAPE.mul(10).div(9));
        }
    }
}
