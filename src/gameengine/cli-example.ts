import { Board } from './board';
import { BoardConfig } from './board-config';
import { IBoardBot } from 'src/interfaces/board-bot.interface';
import { IBot } from 'src/interfaces/bot.interface';
import log from '../logger';
import { DiamondButtonProvider } from './gameobjects/diamond-button/diamond-button-provider';
import { BaseProvider } from './gameobjects/base/base-provider';
import { TeleportProvider } from './gameobjects/teleport/teleport-provider';
import { BotProvider } from './gameobjects/bot/bot-provider';
import { DiamondProvider } from './gameobjects/diamond/diamond-provider';
import { DummyBotProvider } from './gameobjects/dummy-bot/dummy-bot-provider';

log.debug("init");

const providers = [
    new DiamondButtonProvider(),
    new BaseProvider(),
    new DiamondProvider(),
    // new TeleportProvider(), // Skip teleports until fully implemented
    new BotProvider(),
    new DummyBotProvider()
];
const config: BoardConfig = {
    diamondsGenerationRatio: 0.1,
    height: 10,
    width: 10,
    minimumDelayBetweenMoves: 100,
    maxCarryingDiamonds: 5
};
const board = new Board(config, providers, log);

const bot1: IBot = {
    id: "id1"
}
board.join(bot1);
console.log(board.toString());
