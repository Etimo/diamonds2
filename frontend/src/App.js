import React from "react";
import { useBoard } from "./hooks";
import Layout from "./blocks/Layout";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import PlayerTable from "./components/PlayerTable";
import HighScoreTable from "./components/HighScoreTable";
// import AllSeasonsTable from "./components/AllSeasonsTable";
const boardId = 1;
const url = `/api/boards/${boardId}`;
const delay = 250; // 0.25 ms

export default () => {
  const [rows, bots] = useBoard(url, delay);

  return (
    <Layout>
      <Header />
      <Layout.Game>
        <GameBoard rows={rows} />
        <Layout.Tables>
          <PlayerTable bots={bots} />
          <HighScoreTable />
        </Layout.Tables>
      </Layout.Game>
    </Layout>
  );
};
