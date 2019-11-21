import { Board } from "./board";
import createTestBoard from "./util/test-board";
import { BotGameObject } from "./gameobjects/bot/bot";

let board: Board;
let opponent: BotGameObject;
beforeEach(() => {
  board = createTestBoard();
  opponent = new BotGameObject({ x: 1, y: 0 });
  board.addGameObjects([opponent]);
});

test("trySetGameObjectPosition Going out of bounds error returns false", () => {
  const initialPosition = { x: 0, y: 0 };
  const bot = new BotGameObject(initialPosition);

  const result = board.trySetGameObjectPosition(bot, { x: -1, y: 0 });

  expect(result).toBeFalsy();
  expect(bot.position).toStrictEqual(initialPosition);
});

test("trySetGameObjectPosition updates bot position", () => {
  const initialPosition = { x: 0, y: 0 };
  const bot = new BotGameObject(initialPosition);

  const result = board.trySetGameObjectPosition(bot, { x: 1, y: 0 });

  expect(result).toBeTruthy();
  expect(bot.position).toStrictEqual({ x: 1, y: 0 });
});

test("trySetGameObjectPosition when gameobject not allow move bot stays", () => {
  const initialPosition = { x: 0, y: 0 };
  const bot = new BotGameObject(initialPosition);
  spyOn(opponent, "canGameObjectEnter").and.returnValue(false);

  const result = board.trySetGameObjectPosition(bot, { x: 1, y: 0 });

  expect(result).toBeFalsy();
  expect(bot.position).toStrictEqual(initialPosition);
});
