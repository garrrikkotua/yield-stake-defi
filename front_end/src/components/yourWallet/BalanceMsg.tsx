import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

interface BalanceMsgProps {
  label: string;
  amount: number;
  tokenImageSrc: string;
}

const BalanceContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: "inline-grid",
  gridTemplateColumns: "auto auto auto",
  gap: theme.spacing(1),
  alignItems: "center",
}));

export const BalanceMsg = ({
  label,
  amount,
  tokenImageSrc,
}: BalanceMsgProps) => {
  return (
    <BalanceContainer>
      <div>{label}</div>
      <Box sx={{ fontWeight: 700 }}>{amount}</Box>
      <img width={32} src={tokenImageSrc} alt="logo token" />
    </BalanceContainer>
  );
};
