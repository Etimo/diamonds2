import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./pages/game";
import Teams from "./pages/teams";
import Layout from "./blocks/Layout";
import Header from "./components/Header";

export default ({ props, history }) => {
  console.log(props);
  return (
    <Router>
      <Layout>
        <Header />
        <Switch>
          <Route path="/teams">
            <Teams />
          </Route>
          <Route path="*">
            <Game />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};
