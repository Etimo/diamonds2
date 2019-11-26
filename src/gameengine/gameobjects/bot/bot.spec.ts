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
