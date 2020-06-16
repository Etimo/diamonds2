import { registerBot, getBot } from "./api/bot";
import { joinBoard, moveBotOnBoard } from "./api/board";
import { sleep } from "./utils";

export async function register(name, email) {
  const data = await registerBot(name, email);
  console.log("Bot registered - Use token to play!");
  console.log(data);
}

export async function play(token) {
  console.log("play");
  // get bot
  let bot = await getBot(token);
  console.log(bot);

  console.log("EXIT");
  // Join board
  let board = await joinBoard(token);
  bot.setBase(board);

  console.log(data);

  while (true) {
    bot.setPosition(board);

    nextPos = getNextPos();

    moveBotOnBoard();

    await sleep(minimumDelayBetweenMoves);
  }
}
