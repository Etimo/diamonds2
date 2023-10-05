import { Position } from "@etimo/diamonds2-types";
import { beforeEach, expect, it } from "@jest/globals";
import { Board } from "../../board";
import { createTestBoard, createTestBot } from "../../util";
import { BotGameObject } from "../bot/bot";
import { DiamondGameObject } from "./diamond";

let gameObject: DiamondGameObject;
let board: Board;
let bot: BotGameObject;
let diamondPosition: Position;

beforeEach(() => {
  diamondPosition = { x: 0, y: 0 };
  gameObject = new DiamondGameObject(diamondPosition, 1);
  board = createTestBoard();
  bot = createTestBot();
});

it("Stepping on a diamond increases score for bot if there is space in inventory", () => {
  // Arrange
  bot.position = diamondPosition;
  bot.diamonds = 0;
  bot.inventorySize = 5;

  // Act
  gameObject.onGameObjectEntered(bot, board);

  // Assert
  expect(bot.diamonds).toBe(1);
});

it("Stepping on a diamond does not change score if there is no space in inventory", () => {
  bot.position = diamondPosition;
  bot.diamonds = 5;
  bot.inventorySize = 5;

  // Act
  gameObject.onGameObjectEntered(bot, createTestBoard());

  // Assert
  expect(bot.diamonds).toBe(5);
});

it("Stepping on a diamond does not remove diamond if there is no space in inventory", () => {
  // Arrange
  bot.position = diamondPosition;
  bot.diamonds = 5;
  bot.inventorySize = 5;
  board.addGameObjects([gameObject]);

  // Act
  gameObject.onGameObjectEntered(bot, board);

  // Assert
  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(1);
});

it("Returns points in properties", () => {
  expect(gameObject.properties["points"]).toBe(1);
});
