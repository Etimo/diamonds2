import { Board } from "../models/board.js";
import { Bot } from "../models/bot.js";
import { client } from "./client.js";
import { logResponseError } from "./utils.js";

export const registerBot = async (inputName, inputEmail, password, team) => {
  try {
    const response = await client.post("/bots", {
      email: inputEmail,
      name: inputName,
      password: password,
      team: team,
    });
    console.log("response:", response);
    const { name, email, id } = response.data;
    return new Bot(name, email, id);
  } catch (error) {
    logResponseError(error);
  }
};

export const getBot = async (botToken) => {
  try {
    const { data } = await client.get(`/bots/${botToken}`);
    const { name, email, id } = data;

    return new Bot(name, email, id);
  } catch (error) {
    logResponseError(error);
  }
};

export const joinBoard = async (token, boardId) => {
  try {
    const { data } = await client.post(`/bots/${token}/join`, {
      preferredBoardId: boardId,
    });
    console.log(data);
    return Board.dataToBoard(data);
  } catch (error) {
    logResponseError(error);
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
