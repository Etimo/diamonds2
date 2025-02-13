import { beforeEach, expect, it } from "@jest/globals";
import { Board } from "../../board";
import { createTestBoard } from "../../util";
import { FireGameObject } from "./fire";
import { FireProvider } from "./fire-provider";

let provider: FireProvider;
let board: Board;

beforeEach(() => {
  provider = new FireProvider({ fire: 2 });
  board = createTestBoard();
});

it("Creates pair of teleports when board initializes", () => {
  provider.onBoardInitialized(board);

  expect(board.getGameObjectsByType(FireGameObject).length).toBe(2);
});
