import { Board } from "../models/board.js";
import { client } from "./client.js";

export const getBoard = async (boardId) => {
  try {
    const { data } = await client.get(`/boards/${boardId}`);
    return Board.dataToBoard(data);
  } catch {
    return false;
  }
};
