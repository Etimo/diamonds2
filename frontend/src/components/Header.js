import React from "react";
import Header from "../blocks/Header";
import { etimoLogo } from "../images";
import { useLocation } from "react-router-dom";

const teamsOrGameLink = location => {
  if (location.pathname === "/teams") {
    return <Header.Link href="/">Game</Header.Link>;
  }
  return <Header.Link href="/teams">Teams</Header.Link>;
};

export default () => {
  let location = useLocation();
  return (
    <Header>
      <Header.Logo alt="etimoLogo" src={etimoLogo} />
      <Header.Title>Diamonds</Header.Title>
      {teamsOrGameLink(location)}
      <Header.Link
        target="_blank"
        rel="noopener"
        href="https://github.com/Etimo/diamonds2"
      >
        How to play
      </Header.Link>
    </Header>
  );
};
