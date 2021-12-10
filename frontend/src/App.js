import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./pages/game";
import Teams from "./pages/teams";
import Layout from "./blocks/Layout";
import Header from "./components/Header";

export default () => {
  return (
    <Router>
      <Layout>
        <Header />
        <Routes>
          <Route path="/teams" element={<Teams />} />
          <Route path="*" element={<Game />} />
        </Routes>
      </Layout>
    </Router>
  );
};
