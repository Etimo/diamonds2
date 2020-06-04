import React, { useState } from "react";
import { useBoard, getCurrentSeason } from "./hooks";
import Layout from "./blocks/Layout";
import GameBoard from "./components/GameBoard";
import Header from "./components/Header";
import PlayerTable from "./components/PlayerTable";
import HighScoreTable from "./components/HighScoreTable";
import BoardPicker from "./components/BoardPicker";
import SeasonPicker from "./components/SeasonPicker";
// import AllSeasonsTable from "./components/AllSeasonsTable";

export default () => {
  const currentSeason = getCurrentSeason();
  const [boardId, setBoardId] = useState(1);
  const [seasonName, setSeasonName] = useState(0);
  const delay = 250; // 0.25 s

  const [rows, bots] = useBoard(boardId, delay);

  const onBoardChange = event => {
    setBoardId(event.target.value);
  };

  const onSeasonChange = event => {
    setSeasonName(event.target.value);
  };

  return (
    <Layout>
      <Header />
      <Layout.Game>
        <GameBoard rows={rows} />
        <Layout.Tables>
          <BoardPicker value={boardId} onChange={onBoardChange} />
          <PlayerTable bots={bots} boardId={boardId} />
          <SeasonPicker
            value={seasonName ? seasonName : currentSeason}
            onChange={onSeasonChange}
          />
          <HighScoreTable
            seasonName={seasonName ? seasonName : currentSeason}
            currentSeason={currentSeason}
          />
        </Layout.Tables>
      </Layout.Game>
    </Layout>
  );
};
