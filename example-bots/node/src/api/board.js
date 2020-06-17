import { client } from "./client";
import { Board } from "../models/board";

export const joinBoard = async (token) => {
  try {
    const { data } = await client.post("/boards/1/join", {
      botToken: token,
    });
    // return board class
    return Board.dataToBoard(data.data);
  } catch (error) {
    console.log(error);
  }
};

export const getBoard = async (boardId) => {
  try {
    const { data } = await client.get(`/boards/${boardId}`);
    console.log("BOARD");
    console.log(data.data);
    return Board.dataToBoard(data.data);
  } catch (error) {
    return false;
  }
};

export const moveBotOnBoard = async (id, token, direction) => {
  try {
    const { data } = await client.post(`/boards/${id}/move`, {
      botToken: token,
      direction: direction,
    });
    console.log(data);
    return Board.dataToBoard(data.data);
  } catch (error) {
    // Fetch board if move fails
    return await getBoard(id);
  }
};
