import { DiamondButtonGameObject } from "./diamond-button";
import { BotGameObject } from "../bot/bot";
import { Board } from "src/gameengine/board";
import createTestBoard from "../../util/test-board";
import { DiamondGameObject } from "../diamond/diamond";

let button: DiamondButtonGameObject;
let board: Board;

beforeEach(() => {
  button = new DiamondButtonGameObject({ x: 0, y: 0 });
  board = createTestBoard();
});

test("Removes button when bot enters", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  board.addGameObjects([button]);

  button.onGameObjectEntered(bot, board);

  expect(board.getGameObjectsByType(DiamondButtonGameObject).length).toBe(0);
});

test("Removes diamonds when bot enters", () => {
  const bot = new BotGameObject({ x: 0, y: 0 });
  board.addGameObjects([new DiamondGameObject({ x: 0, y: 0 }, 1)]);

  button.onGameObjectEntered(bot, board);

  expect(board.getGameObjectsByType(DiamondGameObject).length).toBe(0);
});
