import { Bot } from "../models/bot";
import { client } from "./client";
import { logResponseError } from "./utils";

export const registerBot = async (inputName, inputEmail, password, team) => {
  try {
    const { data } = await client.post("/bots", {
      email: inputEmail,
      botName: inputName,
      password: password,
      team: team,
    });
    const { botName, email, token } = data.data;
    return new Bot(botName, email, token);
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
