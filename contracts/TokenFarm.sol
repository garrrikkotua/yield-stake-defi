//SPDX-License-Identifier: MIT
// stakeTokens
// unStakeTokens
// issueTokens
// addAllowedTokens
// getEthValue

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.4/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    address[] public allowedTokens;

    //mapping of token address to staker address to amount (aka how much of which token every user staked)
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenToPriceFeed;
    address[] public stakers;
    IERC20 public dappToken;

    constructor(address _dappTokenAddress) {
        dappToken = IERC20(_dappTokenAddress);
    }

    function setPriceFeed(address _token, address _priceFeed) public onlyOwner {
        tokenToPriceFeed[_token] = _priceFeed;
    }

    function issueTokens() public {
        for (uint256 i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint256 totalValue = getUserTotalValue(staker);
            dappToken.transfer(staker, totalValue);
        }
    }

    function getUserTotalValue(address _user) public returns (uint256) {
        uint256 totalValue = 0;
        require(
            uniqueTokensStaked[_user] > 0,
            "You didn't staked anything yet!"
        );
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            totalValue += getUserSingleTokenValue(_user, allowedTokens[i]);
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        if (uniqueTokensStaked[_user] < 0) {
            return 0;
        }

        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return ((stakingBalance[_token][_user] * price) / 10**decimals);
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        address priceFeedAddress = tokenToPriceFeed[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
    }

    function addAllowedToken(address _token) public onlyOwner {
        if (!tokenIsAllowed(_token)) {
            allowedTokens.push(_token);
        }
    }

    function stakeTokens(uint256 _amount, address _token) public {
        // which tokens can be staked
        // how much can be staked
        require(_amount > 0, "You should stake more than zero!");
        require(tokenIsAllowed(_token), "Token is not allowed");
        // sending money from user to our contract -- needs user approval
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);
        stakingBalance[_token][msg.sender] += _amount;
        if (uniqueTokensStaked[msg.sender] == 1) {
            stakers.push(msg.sender);
        }
    }

    function unstakeTokens(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "You don't have enough tokens to unstake!");
        IERC20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0;
        uniqueTokensStaked[msg.sender] -= 1;
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] += 1;
        }
    }

    function tokenIsAllowed(address _token) public view returns (bool) {
        bool result = false;
        for (uint256 i = 0; i < allowedTokens.length; i++) {
            if (allowedTokens[i] == _token) {
                result = true;
            }
        }
        return result;
    }
}
