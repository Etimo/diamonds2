import { client } from "./client";
import { Bot } from "../models/bot";
import { logResponseError } from "./utils";

export const registerBot = async (inputName, inputEmail, password) => {
  try {
    const { data } = await client.post("/bots", {
      email: inputEmail,
      botName: inputName,
      password: password
    });
    const { botName, email, token } = data.data;
    return new Bot(botName, email, token);
  } catch (error) {
    logResponseError(error);
  }
};

export const getBot = async botToken => {
  try {
    const { data } = await client.get(`/bots/${botToken}`);
    const { botName, email, token } = data.data;
    return new Bot(botName, email, token);
  } catch (error) {
    logResponseError(error);
  }
};
