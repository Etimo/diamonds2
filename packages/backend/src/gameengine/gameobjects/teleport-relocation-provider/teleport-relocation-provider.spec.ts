import { Board } from "../../board";
import { createTestBoard } from "../../util";
import { TeleportGameObject } from "../teleport/teleport";
import { TeleportRelocationProvider } from "./teleport-relocation-provider";

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
