import { client } from "./client";
import { Board } from "../models/board";
import { GameObject } from "../models/gameObject";

export const joinBoard = async token => {
  try {
    const { data } = await client.post("/boards/1/join", {
      botToken: token
    });
    // return board class
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getBoard = async boardId => {
  try {
    const { data } = await client.get(`/boards/${boardId}`);
    // return board class
    const {
      id,
      minimumDelayBetweenMoves,
      height,
      width,
      gameObjects
    } = data.data;
    return new Board(
      id,
      minimumDelayBetweenMoves,
      height,
      width,
      getListOfGameObjects(gameObjects)
    );
  } catch (error) {
    console.log(error);
  }
};

export const moveBotOnBoard = async (id, token, direction) => {
  try {
    const { data } = await client.post(`/boards/${id}/move`, {
      botToken: token,
      direction: direction
    });
    // return board class
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

function getListOfGameObjects(gameObjects) {
  return gameObjects.map(go => {
    return new GameObject(go.id, go.position, go.type, go.properties);
  });
}
