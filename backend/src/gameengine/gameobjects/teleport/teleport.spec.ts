import { TeleportGameObject } from "./teleport";
import createTestBoard from "../../util/test-board";
import { BotGameObject } from "../bot/bot";
import { Board } from "../../board";

let teleporterToEnter: TeleportGameObject;
let teleporterPaired: TeleportGameObject;
let notPairedTeleporter: TeleportGameObject;
let board: Board;

beforeEach(() => {
  board = createTestBoard();
  teleporterToEnter = new TeleportGameObject({ x: 0, y: 0 }, "1");
  teleporterPaired = new TeleportGameObject({ x: 9, y: 9 }, "1");
  notPairedTeleporter = new TeleportGameObject({ x: 5, y: 5 }, "2");

  board.addGameObjects([
    teleporterToEnter,
    teleporterPaired,
    notPairedTeleporter,
  ]);
});

test("Stepping on a teleporter moves bot to position of paired teleporter", () => {
  const bot = new BotGameObject({ x: 0, y: 1 });
  bot.position = { x: 0, y: 0 };

  teleporterToEnter.onGameObjectEntered(bot, board);

  expect(bot.position).toStrictEqual(teleporterPaired.position);
});
