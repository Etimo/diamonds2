import { Board } from "../../board";
import { createTestBoard } from "../../util";
import { DiamondButtonGameObject } from "./diamond-button";
import { DiamondButtonProvider } from "./diamond-button-provider";

let provider: DiamondButtonProvider;
let board: Board;

beforeEach(() => {
  provider = new DiamondButtonProvider();
  board = createTestBoard();
});

test("Creates button when board initializes", () => {
  provider.onBoardInitialized(board);

  expect(board.getGameObjectsByType(DiamondButtonGameObject).length).toBe(1);
});

// test("Creates button when button is removed", () => {
//   const button = new DiamondButtonGameObject({ x: 0, y: 0 });

//   board.removeGameObject(button);

//   expect(board.getGameObjectsByType(DiamondButtonGameObject).length).toBe(1);
// });

test("Creates button when button is removed", () => {
  provider.onGameObjectsRemoved(board, []);

  expect(board.getGameObjectsByType(DiamondButtonGameObject).length).toBe(1);
});
