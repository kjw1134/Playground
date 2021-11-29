pragma solidity ^0.5.6;

interface IApePool {

    event SwapToAPE(address indexed user, uint256 amount);
    event SwapToKlay(address indexed user, uint256 amount);

    function swapToAPE() payable external;
    function swapToKlay(uint256 amount) external;
}
