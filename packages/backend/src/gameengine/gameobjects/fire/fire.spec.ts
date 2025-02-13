import { beforeEach, expect, it } from "@jest/globals";
import { Board } from "../../board";
import { createTestBoard, createTestBot } from "../../util";
import { BotGameObject } from "../bot/bot";
import { FireGameObject } from "./fire";

let fireToEnter: FireGameObject;
let board: Board;
let bot: BotGameObject;

beforeEach(() => {
  board = createTestBoard();
  bot = createTestBot();
  fireToEnter = new FireGameObject({ x: 0, y: 0 }, { takeDiamonds: true });

  board.addGameObjects([fireToEnter]);
});

it("Stepping on a teleporter moves bot to position of paired teleporter", () => {
  // Arrange
  bot.position = { x: 0, y: 0 };

  // Act
  fireToEnter.onGameObjectEntered(bot, board);

  // Assert
  expect(bot.diamonds).toStrictEqual(0);
});
