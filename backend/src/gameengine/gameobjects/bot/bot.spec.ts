import { BotGameObject } from "../bot/bot";

let bot: BotGameObject;

beforeEach(() => {
  bot = new BotGameObject({ x: 0, y: 0 });
});

test("Has properties", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.expiresAt = new Date();
  expect(bot.properties).not.toBe(null);
});

test("Can enter if bot is standing there", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 1, y: 1 };
  const other = new BotGameObject({ x: 0, y: 0 });
  other.base = { x: 1, y: 1 };
  other.canTackle = true;
  expect(bot.canGameObjectEnter(other, null)).toBeTruthy();
});

test("Tackles other bot back to base if entering", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 0;
  bot.inventorySize = 5;
  bot.canTackle = true;
  const other = new BotGameObject({ x: 0, y: 0 });
  other.diamonds = 0;
  other.canTackle = true;
  other.inventorySize = 5;

  bot.onGameObjectEntered(other, null);

  expect(bot.position).toEqual(bot.base);
});

test("Steals diamonds when tackling", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 2;
  bot.inventorySize = 5;
  bot.canTackle = true;
  const other = new BotGameObject({ x: 0, y: 0 });
  other.diamonds = 0;
  other.canTackle = true;
  other.inventorySize = 5;

  bot.onGameObjectEntered(other, null);

  expect(other.diamonds).toEqual(2);
});

test("Only steals max possible if inventory full when tackling", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 5;
  bot.inventorySize = 5;
  bot.canTackle = true;
  const other = new BotGameObject({ x: 0, y: 0 });
  other.diamonds = 3;
  other.canTackle = true;
  other.inventorySize = 5;

  bot.onGameObjectEntered(other, null);

  expect(other.diamonds).toEqual(5);
  expect(bot.diamonds).toEqual(3);
});

test("Can't tackle bot, both canTackle false", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 5;
  bot.inventorySize = 5;
  bot.canTackle = false;
  const other = new BotGameObject({ x: 0, y: 1 });
  other.base = { x: 9, y: 5 };
  other.diamonds = 3;
  other.canTackle = false;
  other.inventorySize = 5;

  const canEnter = bot.canGameObjectEnter(other, null);

  expect(canEnter).toBeFalsy();
});

test("Can't tackle bot, entering bot canTackle false", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 5;
  bot.inventorySize = 5;
  bot.canTackle = true;
  const other = new BotGameObject({ x: 0, y: 1 });
  other.base = { x: 9, y: 5 };
  other.diamonds = 3;
  other.canTackle = false;
  other.inventorySize = 5;

  const canEnter = bot.canGameObjectEnter(other, null);

  expect(canEnter).toBeFalsy();
});

test("Should tackle bot, entering bot canTackle true", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 5;
  bot.inventorySize = 5;
  bot.canTackle = false;
  const other = new BotGameObject({ x: 0, y: 1 });
  other.diamonds = 3;
  other.canTackle = true;
  other.inventorySize = 5;

  const canEnter = bot.canGameObjectEnter(other, null);

  expect(canEnter).toBeTruthy();
});

test("Bot tries to enter bas when base is occupied", () => {
  const bot = new BotGameObject({ x: 9, y: 5 });
  bot.base = { x: 10, y: 5 };
  bot.canTackle = false;
  const other = new BotGameObject({ x: 9, y: 4 });
  other.base = { x: 9, y: 5 };
  other.canTackle = false;
  other.inventorySize = 5;

  const canEnter = bot.canGameObjectEnter(other, null);

  expect(canEnter).toBeTruthy();
  expect(bot.position).toEqual(bot.base);
});

// TODO Test when tackle is set to false
