import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import App from "./App";

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
  }
  html {
    box-sizing: border-box;
  }
  *, *:before, *:after {
    box-sizing: inherit;
    font-family: 'PT Sans', sans-serif;
    color: #2C3E50;
  }
`;

ReactDOM.render(
  <React.Fragment>
    <GlobalStyle />
    <App />
  </React.Fragment>,
  // test;
  document.getElementById("root")
);
