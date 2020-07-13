import React from "react";
import Header from "../blocks/Header";
import { etimoLogo } from "../images";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const teamsOrGameLink = location => {
  if (location.pathname === "/") {
    return <Link to="/teams">Teams</Link>;
  }
  return <Link to="/">Game</Link>;
};

export default () => {
  let location = useLocation();
  return (
    <Header>
      <Header.Logo alt="etimoLogo" src={etimoLogo} />
      <Header.Title>Etimo Diamonds</Header.Title>
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
