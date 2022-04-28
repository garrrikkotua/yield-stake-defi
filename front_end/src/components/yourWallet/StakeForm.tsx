import { formatUnits } from "@ethersproject/units";
import { useEthers, useNotifications, useTokenBalance } from "@usedapp/core";
import { Token } from "../Main";
import { Button, Input, CircularProgress, Snackbar } from "@mui/material";
import { Alert } from "@mui/lab";
import React, { useEffect, useState } from "react";
import { useStakeTokens } from "../../hooks/useStakeTokens";
import { utils } from "ethers";

export interface StakeFormProps {
  token: Token;
}

export const StakeForm = ({ token }: StakeFormProps) => {
  const { address: tokenAddress, name } = token;
  const { account } = useEthers();
  const { notifications } = useNotifications();

  const { approveAndStake, approveERC20State, stakeState } =
    useStakeTokens(tokenAddress);

  const tokenBalance = useTokenBalance(tokenAddress, account);
  const formatedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;

  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value);
    setAmount(newAmount);
  };

  const handleStakeSubmit = () => {
    const amountToWei = utils.parseEther(amount.toString());
    return approveAndStake(amountToWei.toString());
  };

  const handleSnackClose = () => {
    setShowERC20ApprovalSuccess(false);
    setShowStakeTokenSuccess(false);
  };

  const isMining =
    approveERC20State.status === "Mining" || stakeState.status === "Mining";

  const [showERC20ApprovalSuccess, setShowERC20ApprovalSuccess] =
    useState(false);
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false);

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Approve ERC20 transfer"
      ).length > 0
    ) {
      setShowERC20ApprovalSuccess(true);
      setShowStakeTokenSuccess(false);
    }
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Stake Tokens"
      ).length > 0
    ) {
      setShowERC20ApprovalSuccess(false);
      setShowStakeTokenSuccess(true);
    }
  }, [notifications, showERC20ApprovalSuccess, showStakeTokenSuccess]);

  return (
    <>
      <div>
        <Input onChange={handleInputChange} />
        <Button
          color="primary"
          size="large"
          onClick={handleStakeSubmit}
          disabled={isMining}
        >
          {isMining ? <CircularProgress size={26} /> : "Stake!!!"}
        </Button>
      </div>
      <Snackbar
        open={showERC20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity="success">
          ERC2o token transfer approved! Now approve the second transaction.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity="success">
          Tokens staked
        </Alert>
      </Snackbar>
    </>
  );
};
