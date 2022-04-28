import React from "react";
import { useEthers } from "@usedapp/core";
import { Button, Box } from "@mui/material";

export const Header = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers();

  const isConnected = account !== undefined;

  return (
    <Box
      sx={{ display: "flex", justifyContent: "flex-end", gap: 1, padding: 4 }}
    >
      {isConnected ? (
        <Button color="primary" variant="contained" onClick={deactivate}>
          Disconnect
        </Button>
      ) : (
        <Button
          color="primary"
          variant="contained"
          onClick={activateBrowserWallet}
        >
          Connect
        </Button>
      )}
    </Box>
  );
};
