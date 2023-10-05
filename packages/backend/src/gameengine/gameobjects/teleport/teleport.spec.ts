import { beforeEach, expect, it } from "@jest/globals";
import { Board } from "../../board";
import { createTestBoard, createTestBot } from "../../util";
import { BotGameObject } from "../bot/bot";
import { TeleportGameObject } from "./teleport";

let teleporterToEnter: TeleportGameObject;
let teleporterPaired: TeleportGameObject;
let notPairedTeleporter: TeleportGameObject;
let board: Board;
let bot: BotGameObject;

beforeEach(() => {
  board = createTestBoard();
  bot = createTestBot();
  teleporterToEnter = new TeleportGameObject({ x: 0, y: 0 }, { pairId: "1" });
  teleporterPaired = new TeleportGameObject({ x: 9, y: 9 }, { pairId: "1" });
  notPairedTeleporter = new TeleportGameObject({ x: 5, y: 5 }, { pairId: "2" });

  board.addGameObjects([
    teleporterToEnter,
    teleporterPaired,
    notPairedTeleporter,
  ]);
});

it("Stepping on a teleporter moves bot to position of paired teleporter", () => {
  // Arrange
  bot.position = { x: 0, y: 0 };

  // Act
  teleporterToEnter.onGameObjectEntered(bot, board);

  // Assert
  expect(bot.position).toStrictEqual(teleporterPaired.position);
});
