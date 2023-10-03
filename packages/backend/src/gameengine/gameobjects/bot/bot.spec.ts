import { IPosition } from "../../../types/position";
import { BotGameObject } from "../bot/bot";

let bot1: BotGameObject;
let bot2: BotGameObject;

beforeEach(() => {
  bot1 = new BotGameObject({
    base: { x: 0, y: 0 },
    diamonds: 0,
    timeJoined: new Date(),
    expiresAt: new Date(),
    inventorySize: 5,
    canTackle: true,
    score: 0,
    name: "test",
    nextMoveAvailableAt: new Date(),
    botId: "1",
  });
  bot2 = new BotGameObject({
    base: { x: 0, y: 0 },
    diamonds: 0,
    timeJoined: new Date(),
    expiresAt: new Date(),
    inventorySize: 5,
    canTackle: true,
    score: 0,
    name: "test",
    nextMoveAvailableAt: new Date(),
    botId: "1",
  });
});

test("Has properties", () => {
  bot1.expiresAt = new Date();
  expect(bot1.properties).not.toBe(null);
});

test("Can enter if bot is standing there", () => {
  const tackleBot = bot2;

  // Set parameters
  tackleBot.canTackle = true;

  expect(bot1.canGameObjectEnter(tackleBot)).toBeTruthy();
});

test("Tackles other bot back to base if entering", () => {
  const tackleBot = bot2;

  // Set parameters
  tackleBot.canTackle = true;

  bot1.onGameObjectEntered(tackleBot);

  expect(bot1.position).toEqual(bot1.base);
});

test("Steals diamonds when tackling", () => {
  const tackleBot = bot2;

  // Set parameters
  tackleBot.diamonds = 0;
  bot1.diamonds = 2;
  tackleBot.canTackle = true;

  bot1.onGameObjectEntered(tackleBot);

  expect(tackleBot.diamonds).toEqual(2);
});

test("Only steals max possible if inventory full when tackling", () => {
  const tackleBot = bot2;

  // Max diamonds
  bot1.diamonds = 5;
  bot1.inventorySize = 5;
  // Only room for two diamonds
  tackleBot.diamonds = 3;
  tackleBot.inventorySize = 5;
  tackleBot.canTackle = true;

  bot1.onGameObjectEntered(tackleBot);

  expect(tackleBot.diamonds).toEqual(5);
  expect(bot1.diamonds).toEqual(3);
});

test("Can't tackle bots, not in base", () => {
  const noTackleBot = bot2;
  let base: IPosition = { x: 5, y: 5 };
  let position: IPosition = { x: 1, y: 1 };

  // Set parameters
  bot1.base = base;
  bot1.position = position;
  bot1.canTackle = false;
  noTackleBot.base = base;
  noTackleBot.position = position;
  noTackleBot.canTackle = false;

  const canEnter = bot1.canGameObjectEnter(noTackleBot);

  expect(canEnter).toBeFalsy();
});

test("Can't tackle bot, not in base", () => {
  const noTackleBot = bot2;
  let base: IPosition = { x: 5, y: 5 };
  let position: IPosition = { x: 1, y: 1 };

  // Set parameters
  bot1.base = base;
  bot1.position = position;
  bot1.canTackle = false;
  noTackleBot.base = base;
  noTackleBot.position = position;
  noTackleBot.canTackle = false;

  const canEnter = bot1.canGameObjectEnter(noTackleBot);

  expect(canEnter).toBeFalsy();
});

test("Should tackle bot, entering bot canTackle true", () => {
  const tackleBot = bot2;

  // Set parameters
  tackleBot.canTackle = true;

  const canEnter = bot1.canGameObjectEnter(tackleBot);

  expect(canEnter).toBeTruthy();
});

test("Bot tries to enter bas when base is occupied", () => {
  const noTackleBot = bot2;
  let basePosition: IPosition = { x: 10, y: 10 };

  // Set parameters
  bot1.position = basePosition;
  noTackleBot.base = basePosition;
  noTackleBot.canTackle = false;

  const canEnter = bot1.canGameObjectEnter(noTackleBot);

  expect(canEnter).toBeTruthy();
  expect(bot1.position).toEqual(bot1.base);
});
