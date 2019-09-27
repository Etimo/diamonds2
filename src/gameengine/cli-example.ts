import { Board } from "./board";
import { BoardConfig } from "./board-config";
import { IBot } from "src/interfaces/bot.interface";
import log from "../logger";
import { DiamondButtonProvider } from "./gameobjects/diamond-button/diamond-button-provider";
import { BaseProvider } from "./gameobjects/base/base-provider";
import { TeleportProvider } from "./gameobjects/teleport/teleport-provider";
import { BotProvider } from "./gameobjects/bot/bot-provider";
import { DiamondProvider } from "./gameobjects/diamond/diamond-provider";
import { DummyBotProvider } from "./gameobjects/dummy-bot/dummy-bot-provider";
import terminalRenderer from "./util/terminal-renderer";

log.debug("init");

const providers = [
  new DiamondButtonProvider(),
  new BaseProvider(),
  new DiamondProvider({
    generationRatio: 0.1,
    minRatioForGeneration: 0.01,
  }),
  // new TeleportProvider(), // Skip teleports until fully implemented
  new BotProvider({
    inventorySize: 5,
  }),
  new DummyBotProvider(),
];
const config: BoardConfig = {
  height: 10,
  width: 10,
  minimumDelayBetweenMoves: 100,
};
const board = new Board(config, providers, log);

const bot1: IBot = {
  id: "id1",
};
board.join(bot1);

// Special renderer that can be used to visualize the board in the terminal
setInterval(() => {
  console.log(terminalRenderer(board));
}, 1000);
