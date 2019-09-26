import { BaseGameObject } from "./base";
import { BotGameObject } from "../bot/bot";
import { BaseProvider } from "./base-provider";
import { Board } from "../../board";

let provider: BaseProvider;
let board: Board;

beforeAll(() => {
  provider = new BaseProvider();
  board = new Board(
    {
      height: 10,
      width: 10,
      minimumDelayBetweenMoves: 100,
    },
    [],
    console,
  );
});

test("Creates base when bot joins", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  provider.onGameObjectsAdded(board, [bot]);
  expect(bot.base).toBeDefined();
});
