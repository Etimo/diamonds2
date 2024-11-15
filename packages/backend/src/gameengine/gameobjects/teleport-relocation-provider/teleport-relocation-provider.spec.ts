import { Board } from "../../board.ts";
import { createTestBoard } from "../../util/index.ts";
import { TeleportGameObject } from "../teleport/teleport.ts";
import { TeleportRelocationProvider } from "./teleport-relocation-provider.ts";

let provider: TeleportRelocationProvider;
let board: Board;
let teleport: TeleportGameObject;

beforeEach(() => {
  jest.useFakeTimers();
  provider = new TeleportRelocationProvider({ seconds: 1 });
  board = createTestBoard([provider]);
  teleport = new TeleportGameObject(board.getEmptyPosition(), { pairId: "1" });
  board.addGameObjects([teleport]);
});

test("Moves teleporter after time", () => {
  const initialPosition = teleport.position;
  provider.onBoardInitialized(board);

  jest.runOnlyPendingTimers();

  expect(teleport.position).not.toEqual(initialPosition);
});
