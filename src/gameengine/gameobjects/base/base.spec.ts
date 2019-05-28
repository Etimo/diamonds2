import { BaseGameObject } from "./base";
import { BotGameObject } from "../bot/bot";
import { Board } from "src/gameengine/board";

let base: BaseGameObject;

beforeAll(() => {
  base = new BaseGameObject({ x: 0, y: 0 });
});

test("Increases score for bot when entering with diamonds", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 3;
  base.onGameObjectEntered(bot, null);
  expect(bot.score).toBe(3);
});

test("Removes diamonds from bot inventory when entering with diamonds", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 3;
  base.onGameObjectEntered(bot, null);
  expect(bot.diamonds).toBe(0);
});
