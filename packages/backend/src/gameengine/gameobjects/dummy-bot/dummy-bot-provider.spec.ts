import { beforeEach, expect, it, jest } from "@jest/globals";
import { Board } from "../../board.ts";
import { createTestBoard } from "../../util/index.ts";
import { DummyBotGameObject } from "./dummy-bot.ts";
import { DummyBotProvider } from "./dummy-bot-provider.ts";

let provider: DummyBotProvider;
let board: Board;

beforeEach(() => {
  provider = new DummyBotProvider({
    inventorySize: 5,
    canTackle: true,
    count: 2,
    prefix: "DummyBot",
  });
  board = createTestBoard();
  jest.useFakeTimers();
});

it("Creates configured number of dummy bots when board initializes", () => {
  provider.onBoardInitialized(board);
  jest.advanceTimersByTime(1001); // Wait for bots to be created

  expect(board.getGameObjectsByType(DummyBotGameObject).length).toBe(2);
});
