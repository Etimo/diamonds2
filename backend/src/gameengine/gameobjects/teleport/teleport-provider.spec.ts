import { Board } from "../../board";
import createTestBoard from "../../util/test-board";
import { TeleportProvider } from "./teleport-provider";
import { TeleportGameObject } from "./teleport";

let provider: TeleportProvider;
let board: Board;

beforeEach(() => {
  provider = new TeleportProvider({ pairs: 1 });
  board = createTestBoard();
});

test("Creates pair of teleports when board initializes", () => {
  provider.onBoardInitialized(board);

  expect(board.getGameObjectsByType(TeleportGameObject).length).toBe(2);
});
