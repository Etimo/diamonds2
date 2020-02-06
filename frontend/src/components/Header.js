import React from "react";
import Header from "../blocks/Header";
import { etimoLogo } from "../images";

export default () => {
  return (
    <Header>
      <Header.Logo alt="etimoLogo" src={etimoLogo} />
      <Header.Title>Etimo Diamonds</Header.Title>
      <Header.Link
        target="_blank"
        rel="noopener"
        href="https://github.com/Etimo/diamonds"
      >
        How to play
      </Header.Link>
    </Header>
  );
};
