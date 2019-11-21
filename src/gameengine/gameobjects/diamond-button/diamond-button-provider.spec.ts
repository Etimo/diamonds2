import { Board } from "../../board";
import createTestBoard from "../../util/test-board";
import { DiamondButtonProvider } from "./diamond-button-provider";
import { DiamondButtonGameObject } from "./diamond-button";

let provider: DiamondButtonProvider;
let board: Board;

beforeAll(() => {
  provider = new DiamondButtonProvider();
  board = createTestBoard();
});

test("Creates button when board initializes", () => {
  provider.onBoardInitialized(board);

  expect(board.getGameObjectsByType(DiamondButtonGameObject).length).toBe(1);
});

test("Creates button when button is removed", () => {
  const button = new DiamondButtonGameObject({x: 0, y: 0});

  provider.onGameObjectsRemoved(board, [button]);

  expect(board.getGameObjectsByType(DiamondButtonGameObject).length).toBe(1);
});
