import { client } from "./client";
import { Bot } from "../models/bot";

export const registerBot = async (name, email) => {
  try {
    const { data } = await client.post("/bots", {
      email: email,
      botName: name
    });
    const { name, email, token } = data.data;
    return new Bot(name, email, token);
  } catch (error) {
    console.log(error);
  }
};

export const getBot = async botToken => {
  try {
    const { data } = await client.get(`/bots/${botToken}`);
    // return bot class
    console.log(data.data);
    const { botName, email, token } = data.data;
    return new Bot(botName, email, token);
  } catch (error) {
    console.log(error);
  }
};
