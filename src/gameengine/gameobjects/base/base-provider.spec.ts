import { BaseGameObject } from "./base";
import { BotGameObject } from "../bot/bot";
import { BaseProvider } from "./base-provider";
import { Board } from "../../board";
import createTestBoard from "../../util/test-board";

let provider: BaseProvider;
let board: Board;

beforeEach(() => {
  provider = new BaseProvider();
  board = createTestBoard();
});

test("Creates base when bot joins", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });

  provider.onGameObjectsAdded(board, [bot]);

  expect(bot.base).toBeDefined();
});

test("Removes base property when bot is removed", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  provider.onGameObjectsAdded(board, [bot]);

  provider.onGameObjectsRemoved(board, [bot]);

  expect(bot.base).toEqual(null);
});
