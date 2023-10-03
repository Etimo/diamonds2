import { Position } from "@etimo/diamonds2-types";
import { createTestBot } from "../../util/test-bot";
import { BotGameObject } from "../bot/bot";
let bot1: BotGameObject;
let bot2: BotGameObject;

beforeEach(() => {
  bot1 = createTestBot();
  bot2 = createTestBot();
});

test("Has properties", () => {
  bot1.expiresAt = new Date();
  expect(bot1.properties).not.toBe(null);
});

test("Can enter if bot is standing there", () => {
  // Arrange
  let tackleBot = bot2;
  tackleBot.canTackle = true;

  // Act -> Assert
  expect(bot1.canGameObjectEnter(tackleBot)).toBeTruthy();
});

test("Tackles other bot back to base if entering", () => {
  // Arrange
  let tackleBot = bot2;
  tackleBot.canTackle = true;

  // Act
  bot1.onGameObjectEntered(tackleBot);

  // Assert
  expect(bot1.position).toEqual(bot1.base);
});

test("Steals diamonds when tackling", () => {
  // Arrange
  let tackleBot = bot2;
  tackleBot.diamonds = 0;
  bot1.diamonds = 2;
  tackleBot.canTackle = true;

  // Act
  bot1.onGameObjectEntered(tackleBot);

  // Assert
  expect(tackleBot.diamonds).toEqual(2);
});

test("Only steals max possible if inventory full when tackling", () => {
  // Arrange
  let tackleBot = bot2;

  // Max diamonds
  bot1.diamonds = 5;
  bot1.inventorySize = 5;
  // Only room for two diamonds
  tackleBot.diamonds = 3;
  tackleBot.inventorySize = 5;
  tackleBot.canTackle = true;

  // Act
  bot1.onGameObjectEntered(tackleBot);

  // Assert
  expect(tackleBot.diamonds).toEqual(5);
  expect(bot1.diamonds).toEqual(3);
});

test("Can't tackle bots, not in base", () => {
  // Arrange
  let noTackleBot = bot2;
  let base: Position = { x: 5, y: 5 };
  let position: Position = { x: 1, y: 1 };

  bot1.base = base;
  bot1.position = position;
  bot1.canTackle = false;
  noTackleBot.base = base;
  noTackleBot.position = position;
  noTackleBot.canTackle = false;

  // Act
  const canEnter = bot1.canGameObjectEnter(noTackleBot);

  // Assert
  expect(canEnter).toBeFalsy();
});

test("Can't tackle bot, not in base", () => {
  // Arrange
  let noTackleBot = bot2;
  let base: Position = { x: 5, y: 5 };
  let position: Position = { x: 1, y: 1 };
  bot1.base = base;
  bot1.position = position;
  bot1.canTackle = false;
  noTackleBot.base = base;
  noTackleBot.position = position;
  noTackleBot.canTackle = false;

  // Act
  const canEnter = bot1.canGameObjectEnter(noTackleBot);

  // Assert
  expect(canEnter).toBeFalsy();
});

test("Should tackle bot, entering bot canTackle true", () => {
  // Arrange
  let tackleBot = bot2;
  tackleBot.canTackle = true;

  // Act
  const canEnter = bot1.canGameObjectEnter(tackleBot);

  // Assert
  expect(canEnter).toBeTruthy();
});

test("Bot tries to enter bas when base is occupied", () => {
  // Arrange
  let noTackleBot = bot2;
  let basePosition: Position = { x: 10, y: 10 };

  bot1.position = basePosition;
  noTackleBot.base = basePosition;
  noTackleBot.canTackle = false;

  // Act
  const canEnter = bot1.canGameObjectEnter(noTackleBot);

  // Assert
  expect(canEnter).toBeTruthy();
  expect(bot1.position).toEqual(bot1.base);
});
