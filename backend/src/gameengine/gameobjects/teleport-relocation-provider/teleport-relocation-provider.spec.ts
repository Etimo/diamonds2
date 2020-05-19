import { Board } from "../../board";
import createTestBoard from "../../util/test-board";
import { TeleportRelocationProvider } from "./teleport-relocation-provider";
import { TeleportGameObject } from "../teleport/teleport";

let provider: TeleportRelocationProvider;
let board: Board;
let teleport: TeleportGameObject;

beforeEach(() => {
  provider = new TeleportRelocationProvider({ seconds: 1 });
  board = createTestBoard([provider]);
  teleport = new TeleportGameObject(board.getEmptyPosition(), "1");
  board.addGameObjects([teleport]);

  jest.useFakeTimers();
});

test("Moves teleporter after time", () => {
  const initialPosition = teleport.position;
  provider.onBoardInitialized(board);

  jest.runOnlyPendingTimers();

  expect(teleport.position).not.toEqual(initialPosition);
});
