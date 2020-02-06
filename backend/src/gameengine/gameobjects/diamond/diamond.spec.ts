import { BotGameObject } from "../bot/bot";
import { DiamondGameObject } from "./diamond";
import createTestBoard from "../../util/test-board";

let gameObject: DiamondGameObject;

beforeAll(() => {
  gameObject = new DiamondGameObject({ x: 0, y: 0 }, 1);
});

test("Stepping on a diamond increases score for bot", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  bot.diamonds = 0;
  bot.inventorySize = 5;

  gameObject.onGameObjectEntered(bot, createTestBoard());

  expect(bot.diamonds).toBe(1);
});
