import React, { useState } from "react";
import { useBoard } from "./hooks";
import Layout from "./blocks/Layout";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import PlayerTable from "./components/PlayerTable";
import HighScoreTable from "./components/HighScoreTable";
import BoardPicker from "./components/BoardPicker";
// import AllSeasonsTable from "./components/AllSeasonsTable";

export default () => {
  const [boardId, setBoardId] = useState(1);
  const delay = 250; // 0.25 s

  const [rows, bots] = useBoard(boardId, delay);

  const onBoardChange = (event) => {
    setBoardId(event.target.value);
  };

  return (
    <Layout>
      <Header />
      <Layout.Game>
        <GameBoard rows={rows} />
        <Layout.Tables>
          <BoardPicker value={boardId} onChange={onBoardChange} />
          <PlayerTable bots={bots} />
          <HighScoreTable />
        </Layout.Tables>
      </Layout.Game>
    </Layout>
  );
};
