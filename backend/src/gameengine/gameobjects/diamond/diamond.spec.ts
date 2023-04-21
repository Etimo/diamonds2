import { beforeEach, expect, it } from "@jest/globals";
import { createTestBoard } from "../../util";
import { BotGameObject } from "../bot/bot";
import { DiamondGameObject } from "./diamond";

let gameObject: DiamondGameObject;

beforeEach(() => {
  gameObject = new DiamondGameObject({ x: 0, y: 0 }, 1);
});

it("Stepping on a diamond increases score for bot if there is space in inventory", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 0;
  bot.inventorySize = 5;

  gameObject.onGameObjectEntered(bot, createTestBoard());

  expect(bot.diamonds).toBe(1);
});

it("Stepping on a diamond does not change score if there is no space in inventory", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 5;
  bot.inventorySize = 5;

  gameObject.onGameObjectEntered(bot, createTestBoard());

  expect(bot.diamonds).toBe(5);
});

it("Stepping on a diamond does not remove diamond if there is no space in inventory", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 5;
  bot.inventorySize = 5;
  const board = createTestBoard();
  board.addGameObjects([gameObject]);

  gameObject.onGameObjectEntered(bot, board);

  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(1);
});

it("Returns points in properties", () => {
  expect(gameObject.properties["points"]).toBe(1);
});
