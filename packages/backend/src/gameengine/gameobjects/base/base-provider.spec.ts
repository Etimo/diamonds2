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
  // Act
  provider.onGameObjectsAdded(board, [bot]);

  // Assert
  expect(bot.base).toBeDefined();
});

test("Removes base property when bot is removed", () => {
  // Act
  provider.onGameObjectsAdded(board, [bot]);
  provider.onGameObjectsRemoved(board, [bot]);

  // Assert
  expect(bot.base).toEqual(null);
});
