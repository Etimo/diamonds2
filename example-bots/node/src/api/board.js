import { client } from "./client";
import { Board } from "../models/board";
import { logResponseError } from "./utils";

export const joinBoard = async (token, boardId) => {
  try {
    const { data } = await client.post(`/boards/${boardId}/join`, {
      botToken: token,
    });
    return Board.dataToBoard(data.data);
  } catch (error) {
    logResponseError(error);
  }
};

export const getBoard = async (boardId) => {
  try {
    const { data } = await client.get(`/boards/${boardId}`);
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
    return Board.dataToBoard(data.data);
  } catch (error) {
    // Fetch board if move fails
    return await getBoard(id);
  }
};
