import { Position } from "@etimo/diamonds2-types";
import { createTestBot } from "../../util";
import { BotGameObject } from "../bot/bot";
import { BaseGameObject } from "./base";
let bot: BotGameObject;
let baseLessBot: BotGameObject;
let base: BaseGameObject;

beforeEach(() => {
  bot = createTestBot();
  baseLessBot = createTestBot();
  base = new BaseGameObject(bot);
});

test("Increases score for bot when entering with diamonds", () => {
  // Arrange
  bot.diamonds = 3;
  bot.score = 0;

  // Act
  base.onGameObjectEntered(bot);

  // Assert
  expect(bot.score).toBe(3);
});

test("Removes diamonds from bot inventory when entering with diamonds", () => {
  // Arrange
  let basePosition: Position = { x: 0, y: 0 };
  bot.base = basePosition;
  base.position = basePosition;
  bot.diamonds = 3;
  bot.score = 0;

  // Act
  base.onGameObjectEntered(bot);

  // Assert
  expect(bot.diamonds).toBe(0);
});

test("Add score when entering with diamonds", () => {
  // Arrange
  let basePosition: Position = { x: 0, y: 0 };
  bot.base = basePosition;
  base.position = basePosition;
  bot.diamonds = 3;
  bot.score = 0;

  // Act
  base.onGameObjectEntered(bot);

  // Assert
  expect(bot.score).toBe(3);
});

test("Only allow the bot belonging to base to drop of diamonds", () => {
  // Arrange
  let basePosition: Position = { x: 0, y: 0 };
  base.position = basePosition;
  baseLessBot.base = basePosition;
  baseLessBot.score = 0;
  baseLessBot.diamonds = 3;

  // Act
  base.onGameObjectEntered(baseLessBot);

  // Assert
  expect(baseLessBot.diamonds).toBe(3);
});

test("Only allow bases bot to get score", () => {
  // Arrange
  baseLessBot.score = 0;
  baseLessBot.diamonds = 3;

  // Act
  base.onGameObjectEntered(baseLessBot);

  // Assert
  expect(baseLessBot.score).toBe(0);
});
