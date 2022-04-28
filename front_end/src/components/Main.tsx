import { ChainId, useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import dapp from "../dapp.png";
import eth from "../eth.png";
import dai from "../dai.png";
import { YourWallet } from "./yourWallet/YourWallet";

export type Token = {
  image: string;
  address: string;
  name: string;
};

export const Main = () => {
  const { chainId } = useEthers();
  const networkName = chainId ? helperConfig[chainId] : "dev";

  const dappTokenAddress =
    chainId && String(chainId) in networkMapping
      ? networkMapping[String(chainId)]["DappToken"][0]
      : constants.AddressZero;

  const wethTokenAddress =
    chainId && networkName in brownieConfig["networks"]
      ? brownieConfig["networks"][networkName]["weth_token"]
      : constants.AddressZero;

  const fauTokenAddress =
    chainId && networkName in brownieConfig["networks"]
      ? brownieConfig["networks"][networkName]["fau_token"]
      : constants.AddressZero;

  const networks: Array<Token> = [
    {
      image: dapp,
      address: dappTokenAddress,
      name: "DIAP",
    },
    {
      image: eth,
      address: wethTokenAddress,
      name: "WETH",
    },
    {
      image: dai,
      address: fauTokenAddress,
      name: "DAI",
    },
  ];
  return <YourWallet networks={networks} />;
};
