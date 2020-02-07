import { BotGameObject } from "../bot/bot";
import { DiamondGameObject } from "./diamond";
import createTestBoard from "../../util/test-board";

let gameObject: DiamondGameObject;

beforeEach(() => {
  gameObject = new DiamondGameObject({ x: 0, y: 0 }, 1);
});

test("Stepping on a diamond increases score for bot if there is space in inventory", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 0;
  bot.inventorySize = 5;

  gameObject.onGameObjectEntered(bot, createTestBoard());

  expect(bot.diamonds).toBe(1);
});

test("Stepping on a diamond does not change score if there is no space in inventory", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 5;
  bot.inventorySize = 5;

  gameObject.onGameObjectEntered(bot, createTestBoard());

  expect(bot.diamonds).toBe(5);
});

test("Stepping on a diamond does not remove diamond if there is no space in inventory", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 5;
  bot.inventorySize = 5;
  const board = createTestBoard();
  board.addGameObjects([gameObject]);

  gameObject.onGameObjectEntered(bot, board);

  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(1);
});

test("Returns points in properties", () => {
  expect(gameObject.properties["points"]).toBe(1);
});
