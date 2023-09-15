import { BaseGameObject } from "./base";
import { BotGameObject } from "../bot/bot";

test("Increases score for bot when entering with diamonds", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  const base = new BaseGameObject(bot);
  bot.diamonds = 3;
  bot.score = 0;
  base.onGameObjectEntered(bot, null);
  expect(bot.score).toBe(3);
});

test("Removes diamonds from bot inventory when entering with diamonds", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  const base = new BaseGameObject(bot);
  bot.diamonds = 3;
  bot.score = 0;
  base.onGameObjectEntered(bot, null);
  expect(bot.diamonds).toBe(0);
});

test("Only allow correct bot to drop off diamonds", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  const bot2 = new BotGameObject({ x: 1, y: 0 });
  const base = new BaseGameObject(bot);
  bot.base = { x: 0, y: 1 };
  bot2.base = { x: 1, y: 1 };
  bot.diamonds = 3;
  bot.score = 0;
  bot2.diamonds = 4;
  bot2.score = 0;

  // Enter base
  base.onGameObjectEntered(bot2, null);

  // Diamonds should still be in inventory
  expect(bot2.diamonds).toBe(4);
  expect(bot2.score).toBe(0);
});
