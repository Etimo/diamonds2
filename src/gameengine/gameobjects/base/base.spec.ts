import { BaseGameObject } from "./base";
import { BotGameObject } from "../bot/bot";

let base: BaseGameObject;

beforeEach(() => {
  base = new BaseGameObject({ x: 0, y: 0 });
});

test("Increases score for bot when entering with diamonds", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 3;
  bot.score = 0;
  base.onGameObjectEntered(bot, null);
  expect(bot.score).toBe(3);
});

test("Removes diamonds from bot inventory when entering with diamonds", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 3;
  bot.score = 0;
  base.onGameObjectEntered(bot, null);
  expect(bot.diamonds).toBe(0);
});
