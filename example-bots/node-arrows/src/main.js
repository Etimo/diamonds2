import process from "node:process";
import { getBot, joinBoard, moveBotOnBoard, registerBot } from "./api/bot.js";
import {
  couldNotJoinBoard,
  gameStarted,
  registrationFailed,
  registrationSuccessful,
} from "./messages.js";
import { sleep } from "./utils.js";

export const register = async (name, email, password, team) => {
  const bot = await registerBot(name, email, password, team);
  if (bot) {
    registrationSuccessful(bot);
  } else {
    registrationFailed(name, email);
  }
};

const keypress = () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", (data) => {
      const byteArray = [...data];
      if (byteArray.length > 0 && byteArray[0] === 3) {
        console.log("^C");
        process.exit(1);
      }
      process.stdin.setRawMode(false);
      let direction = undefined;
      switch (byteArray[2]) {
        case 65:
          direction = "NORTH";
          break;
        case 66:
          direction = "SOUTH";
          break;
        case 67:
          direction = "EAST";
          break;
        case 68:
          direction = "WEST";
          break;
      }
      resolve(direction);
    })
  );
};

export const play = async (token, boardId) => {
  gameStarted();
  // Gets the provided logic
  const bot = await getBot(token);

  // Join board
  let board = await joinBoard(token, boardId);

  if (!board) {
    couldNotJoinBoard();
  }
  bot.setBase(board);

  while (true) {
    bot.updateBotInfo(board);

    const direction = await keypress();
    if (direction) {
      board = await moveBotOnBoard(board.id, bot.token, direction);
      await sleep(board.minimumDelayBetweenMoves);
    }
  }
};
