import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/game";
import Teams from "./pages/teams";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Game />
        </Route>
        <Route path="/teams">
          <Teams />
        </Route>
      </Switch>
    </Router>
  );
};
