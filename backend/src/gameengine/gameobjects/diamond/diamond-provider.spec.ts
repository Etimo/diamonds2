import { beforeEach, expect, it } from "@jest/globals";
import { Board } from "../../board";
import { createTestBoard } from "../../util";
import { DiamondGameObject } from "./diamond";
import { DiamondProvider } from "./diamond-provider";

let provider: DiamondProvider;
let board: Board;

beforeEach(() => {
  provider = new DiamondProvider({
    generationRatio: 0.1,
    minRatioForGeneration: 0.01,
    redRatio: 0,
  });
  board = createTestBoard();
});

it("Generates diamonds when board initializes", () => {
  provider.onBoardInitialized(board);

  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(10);
});

it("Generates diamonds when all diamonds have been removed", () => {
  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(0);
  // Simulate something was removed
  provider.onGameObjectsRemoved(board, []);

  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(10);
});

it("Doesnt generates diamonds when some diamonds have been removed only", () => {
  board.addGameObjects([new DiamondGameObject({ x: 0, y: 0 }, 1)]);

  // Simulate something was removed
  provider.onGameObjectsRemoved(board, []);

  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(1);
});
