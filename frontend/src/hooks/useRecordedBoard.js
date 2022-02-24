import { useState, useEffect } from "react";
import useFetchRepeatedly from "./useFetchRepeatedly";
import _ from "lodash";
import Axios from "axios";
import { useInterval } from ".";

const botGameObjectName = "BotGameObject";

const createBoard = ({ width, height, gameObjects }) => {
  const rows = [];
  for (let y = 0; y < height; y++) {
    rows.push([]);
    for (let x = 0; x < width; x++) {
      rows[y][x] = {
        type: "",
        properties: {}
      };
    }
  }

  // Add game objects
  gameObjects.forEach(go => {
    rows[go.position.y][go.position.x] = {
      ...rows[go.position.y][go.position.x],
      type: rows[go.position.y][go.position.x].type + go.type,
      properties: go.properties
    };
  });
  return rows;
};

export default (seasonId, recordingId) => {
  const [activeBot, setActiveBot] = useState(null);
  const [response, setResponse] = useState(null);
  const [rows, setRows] = useState([[]]);
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  // const boardData = useFetchRepeatedly(`/api/boards/${boardId}`, delay, {});
  const fetch = async () => {
    const { data } = await Axios.get(
      "/api/recordings/" + seasonId + "/" + recordingId
    );
    setResponse(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, [seasonId, recordingId]);

  useEffect(() => {
    if (!loading) {
      setActiveBot(response.botName);
      const data = response.recording[0];
      if (!_.isEmpty(data)) {
        setRows(createBoard(data));
        setBots(data.gameObjects.filter(b => b.type === botGameObjectName));
      }
    }
  }, [loading]);

  useInterval(() => {
    if (!loading && rows && response.recording.length) {
      const data = response.recording.shift();
      if (!_.isEmpty(data)) {
        setRows(createBoard(data));
        setBots(data.gameObjects.filter(b => b.type === botGameObjectName));
      }
    } else if (!loading && rows && response.recording.length === 0) {
      console.log("done");
    }
  }, 100);

  return [loading, rows, bots, activeBot];
};
