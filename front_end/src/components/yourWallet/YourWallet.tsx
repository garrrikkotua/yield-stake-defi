import { Token } from "../Main";
import { Box, Tab, styled } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useState } from "react";
import { WalletBalance } from "./WalletBalance";
import { StakeForm } from "./StakeForm";

interface YourWalletProps {
  networks: Array<Token>;
}

export const YourWallet = ({ networks }: YourWalletProps) => {
  const [activeToken, setActiveToken] = useState<Number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveToken(parseInt(newValue));
  };

  return (
    <Box>
      <h1 style={{ color: "white" }}>Your wallet!</h1>
      <Box sx={{ backgroundColor: "white", borderRadius: "25px" }}>
        <TabContext value={activeToken.toString()}>
          <TabList onChange={handleChange} aria-label="stake form tabs">
            {networks.map((token, index) => {
              return (
                <Tab label={token.name} value={index.toString()} key={index} />
              );
            })}
          </TabList>
          {networks.map((token, index) => (
            <TabPanel value={index.toString()} key={index}>
              <Box
                sx={(theme) => ({
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: theme.spacing(4),
                })}
              >
                <WalletBalance token={networks[activeToken.toFixed(0)]} />
                <StakeForm token={networks[activeToken.toFixed(0)]} />
              </Box>
            </TabPanel>
          ))}
        </TabContext>
      </Box>
    </Box>
  );
};
