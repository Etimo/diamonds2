import { beforeEach, expect, it } from "@jest/globals";
import { Board } from "../../board.ts";
import { createTestBoard } from "../../util/index.ts";
import { TeleportGameObject } from "./teleport.ts";
import { TeleportProvider } from "./teleport-provider.ts";

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
