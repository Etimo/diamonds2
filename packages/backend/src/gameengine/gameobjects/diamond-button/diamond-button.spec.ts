import { Board } from "../../board.ts";
import { createTestBoard, createTestBot } from "../../util/index.ts";
import { BotGameObject } from "../bot/bot.ts";
import { DiamondGameObject } from "../diamond/diamond.ts";
import { DiamondButtonGameObject } from "./diamond-button.ts";

let button: DiamondButtonGameObject;
let board: Board;
let bot: BotGameObject;

beforeEach(() => {
  board = createTestBoard();
  bot = createTestBot();
});

test("Removes button when bot enters", () => {
  // Arrange
  let position = { x: 0, y: 0 };
  button = new DiamondButtonGameObject(position);
  bot.position = position;
  board.addGameObjects([button]);

  // Act
  button.onGameObjectEntered(bot, board);

  // Assert
  expect(board.getGameObjectsByType(DiamondButtonGameObject).length).toBe(0);
});

test("Removes diamonds when bot enters", () => {
  // Arrange
  let position = { x: 0, y: 0 };
  button = new DiamondButtonGameObject(position);
  bot.position = position;
  board.addGameObjects([button]);

  // Act
  button.onGameObjectEntered(bot, board);

  // Assert
  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(0);
});
