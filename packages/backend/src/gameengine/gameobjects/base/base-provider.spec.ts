import { Board } from "../../board";
import { createTestBoard, createTestBot } from "../../util";
import { BotGameObject } from "../bot/bot";
import { BaseProvider } from "./base-provider";

let provider: BaseProvider;
let board: Board;
let bot: BotGameObject;

beforeEach(() => {
  provider = new BaseProvider();
  board = createTestBoard();
  bot = createTestBot();
});

test("Creates base when bot joins", () => {
  // Arrange
  bot.position = { x: 0, y: 0 };

  // Act
  provider.onGameObjectsAdded(board, [bot]);

  // Assert
  expect(bot.base).toBeDefined();
});

test("Removes base property when bot is removed", () => {
  // Arrange
  bot.position = { x: 0, y: 0 };
  provider.onGameObjectsAdded(board, [bot]);

  // Act
  provider.onGameObjectsRemoved(board, [bot]);

  // Assert
  expect(bot.base).toEqual(null);
});
