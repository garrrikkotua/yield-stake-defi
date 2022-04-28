import { useContractFunction, useEthers } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import ERC20 from "../chain-info/contracts/dependencies/smartcontractkit/chainlink-brownie-contracts@0.4.0/ERC20.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants, utils } from "ethers";
import { Contract } from "@usedapp/core/node_modules/@ethersproject/contracts";
import { useEffect, useState } from "react";

export const useStakeTokens = (tokenAddress: string) => {
  const { chainId } = useEthers();
  const { abi } = TokenFarm;
  const { abi: erc20ABI } = ERC20;

  const tokenFarmAddress =
    chainId && String(chainId) in networkMapping
      ? networkMapping[String(chainId)]["TokenFarm"][0]
      : constants.AddressZero;

  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface);

  const erc20Interface = new utils.Interface(erc20ABI);
  const erc20Contract = new Contract(tokenAddress, erc20Interface);

  const { send: approveERC20Send, state: approveERC20State } =
    useContractFunction(erc20Contract, "approve", {
      transactionName: "Approve ERC20 transfer",
    });

  const approveAndStake = (amount: string) => {
    setAmountToStake(amount);
    return approveERC20Send(tokenFarmAddress, amount);
  };

  const { send: stakeSend, state: stakeState } = useContractFunction(
    tokenFarmContract,
    "stakeTokens",
    { transactionName: "Stake Tokens" }
  );

  const [amountToStake, setAmountToStake] = useState("0");

  useEffect(() => {
    if (approveERC20State.status === "Success") {
      stakeSend(amountToStake, tokenAddress);
    }
  }, [approveERC20State, amountToStake, tokenAddress]);

  return { approveAndStake, approveERC20State, stakeState };
};
