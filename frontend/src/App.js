import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./pages/game";
import Teams from "./pages/teams";
import Recording from "./pages/recording";
import Layout from "./blocks/Layout";
import Header from "./components/Header";

export default () => {
  return (
    <Router>
      <Layout>
        <Header />
        <Route path="/teams">
          <Teams />
        </Route>
        <Route path="/recording/*">
          <Recording />
        </Route>
        <Route path="*">
          <Game />
        </Route>
      </Layout>
    </Router>
  );
};
