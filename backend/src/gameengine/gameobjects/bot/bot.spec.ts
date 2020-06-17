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
  const other = new BotGameObject({ x: 0, y: 0 });
  expect(bot.canGameObjectEnter(other, null)).toBeTruthy();
});

test("Tackles other bot back to base if entering", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = {x: 10, y: 5};
  bot.diamonds = 0;
  bot.inventorySize = 5;
  const other = new BotGameObject({ x: 0, y: 0 });
  other.diamonds = 0;
  other.inventorySize = 5;

  bot.onGameObjectEntered(other, null);

  expect(bot.position).toEqual(bot.base);
});

test("Steals diamonds when tackling", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 2;
  bot.inventorySize = 5;
  const other = new BotGameObject({ x: 0, y: 0 });
  other.diamonds = 0;
  other.inventorySize = 5;

  bot.onGameObjectEntered(other, null);

  expect(other.diamonds).toEqual(2);
});

test("Only steals max possible if inventory full when tackling", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.base = { x: 10, y: 5 };
  bot.diamonds = 5;
  bot.inventorySize = 5;
  const other = new BotGameObject({ x: 0, y: 0 });
  other.diamonds = 3;
  other.inventorySize = 5;

  bot.onGameObjectEntered(other, null);

  expect(other.diamonds).toEqual(5);
  expect(bot.diamonds).toEqual(3);
});
