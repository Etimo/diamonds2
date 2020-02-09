import { useState, useEffect } from "react";
import useFetchRepeatedly from "./useFetchRepeatedly";
import _ from "lodash";

const botGameObjectName = "BotGameObject";

const createBoard = ({ width, height, gameObjects }) => {
  const rows = [];
  for (let y = 0; y < height; y++) {
    rows.push([]);
    for (let x = 0; x < width; x++) {
      rows[y][x] = [];
    }
  }

  // Add game objects
  gameObjects.forEach(go => {
    rows[go.position.y][go.position.x].push({
      type: go.type,
      name: go.name,
      properties: go.properties
    });
  });
  return rows;
};

export default (url, delay) => {
  const [rows, setRows] = useState([[]]);
  const [bots, setBots] = useState([]);
  const boardData = useFetchRepeatedly(url, delay, {});

  useEffect(() => {
    if (!_.isEmpty(boardData)) {
      setRows(createBoard(boardData));
      setBots(boardData.gameObjects.filter(b => b.type === botGameObjectName));
    }
  }, [boardData]);

  return [rows, bots];
};
