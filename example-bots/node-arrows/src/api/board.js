import { Board } from "../models/board";
import { client } from "./client";

export const getBoard = async (boardId) => {
  try {
    const { data } = await client.get(`/boards/${boardId}`);
    return Board.dataToBoard(data);
  } catch (error) {
    return false;
  }
};
