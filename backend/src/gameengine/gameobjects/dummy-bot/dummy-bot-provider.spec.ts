import { Board } from "../../board";
import createTestBoard from "../../util/test-board";
import { DummyBotProvider } from "./dummy-bot-provider";
import { DummyBotGameObject } from "./dummy-bot";

let provider: DummyBotProvider;
let board: Board;

beforeEach(() => {
  provider = new DummyBotProvider({
    inventorySize: 5,
    canTackle: true,
    count: 1,
    prefix: "DummyBot",
  });
  board = createTestBoard();
  jest.useFakeTimers();
});

test("Creates dummy bots when board initializes", () => {
  provider.onBoardInitialized(board);
  jest.runOnlyPendingTimers();

  expect(board.getGameObjectsByType(DummyBotGameObject).length).toBe(1);
});

test("Creates configured number of dummy bots when board initializes", () => {
  provider = new DummyBotProvider({
    inventorySize: 5,
    canTackle: true,
    count: 2,
    prefix: "DummyBot",
  });

  provider.onBoardInitialized(board);
  jest.runOnlyPendingTimers();

  expect(board.getGameObjectsByType(DummyBotGameObject).length).toBe(2);
});
