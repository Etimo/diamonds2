import { registerBot, getBot } from "./api/bot";
import { joinBoard, moveBotOnBoard } from "./api/board";
import { sleep } from "./utils";
import { registrationSuccessful, registrationFailed } from "./messages";
import { getDirection } from "./logic/utils";
import { getFirstDiamond } from "./logic/firstDiamondLogic";
import { positionIsSame } from "./utils";
import { invalidLogic, couldNotJoinBoard, gameStarted } from "./messages";

const logics = { firstDiamondLogic: getFirstDiamond };

export const register = async (name, email, password, team) => {
  const bot = await registerBot(name, email, password, team);
  if (bot) {
    registrationSuccessful(bot);
  } else {
    registrationFailed(name, email);
  }
};

export const play = async (token, logic, boardId) => {
  gameStarted();
  // Gets the provided logic
  const logicFunction = getLogic(logic);
  if (!logicFunction) {
    invalidLogic();
  }
  let bot = await getBot(token);

  // Join board
  let board = await joinBoard(token, boardId);
  if (!board) {
    couldNotJoinBoard();
  }
  bot.setBase(board);

  while (true) {
    bot.updateBotInfo(board);

    let targetPosition = getTargetPosition(bot, board, logicFunction);
    if (targetPosition) {
      bot.targetPosition = targetPosition;
    }

    let direction = getDirection(bot);

    board = await moveBotOnBoard(board.id, bot.token, direction);
    await sleep(board.minimumDelayBetweenMoves * 10);
  }
};

const getTargetPosition = (bot, board, logicFunction) => {
  // Get targetPosition if position is null (just started)
  // or if position is the same as targetPosition and diamonds is less then 5 (we still have space in the inventory)
  if (
    !bot.targetPosition ||
    (positionIsSame(bot.targetPosition, bot.position) && bot.diamonds < 5)
  ) {
    return logicFunction(bot, board);
  }

  // Change targetPosition to base if inventory is full (return diamonds)
  if (bot.diamonds === 5) {
    return bot.base;
  }

  // We should not change target position
  return false;
};

const getLogic = logic => {
  const logicArray = Object.entries(logics).find(item => item[0] === logic);
  if (logicArray) {
    return logicArray[1];
  }
  return null;
};
