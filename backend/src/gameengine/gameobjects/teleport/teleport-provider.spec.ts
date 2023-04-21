import { beforeEach, expect, it } from "@jest/globals";
import { Board } from "../../board";
import { createTestBoard } from "../../util";
import { TeleportGameObject } from "./teleport";
import { TeleportProvider } from "./teleport-provider";

let provider: TeleportProvider;
let board: Board;

beforeEach(() => {
  provider = new TeleportProvider({ pairs: 1 });
  board = createTestBoard();
});

it("Creates pair of teleports when board initializes", () => {
  provider.onBoardInitialized(board);

  expect(board.getGameObjectsByType(TeleportGameObject).length).toBe(2);
});
