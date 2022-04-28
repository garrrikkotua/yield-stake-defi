import React from "react";
import { Header } from "./components/Header";
import { Container } from "@mui/material";
import { Main } from "./components/Main";

function App() {
  return (
    <>
      <Header />
      <Container sx={{ maxWidth: "md" }}>
        <h1 style={{ color: "white", textAlign: "center" }}>DIAP Token App</h1>
        <Main />
      </Container>
    </>
  );
}

export default App;
