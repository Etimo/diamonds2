import { Board } from "../models/board";
import { client } from "./client";
import { logResponseError } from "./utils";

export const joinBoard = async (token, boardId) => {
  try {
    const { data } = await client.post(`/bots/${token}/join`, {
      preferredBoardId: boardId,
    });
    return Board.dataToBoard(data);
  } catch (error) {
    logResponseError(error);
  }
};

export const getBoard = async (boardId) => {
  try {
    const { data } = await client.get(`/boards/${boardId}`);
    return Board.dataToBoard(data);
  } catch (error) {
    return false;
  }
};

export const moveBotOnBoard = async (id, token, direction) => {
  try {
    const { data } = await client.post(`/bots/${token}/move`, {
      direction: direction,
    });
    return Board.dataToBoard(data);
  } catch (error) {
    // Fetch board if move fails
    return await getBoard(id);
  }
};
