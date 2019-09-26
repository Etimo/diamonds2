import { Injectable, Scope } from "@nestjs/common";
import { Board } from "src/gameengine/board";
import { CustomLogger } from "src/logger";
import { DiamondButtonProvider } from "src/gameengine/gameobjects/diamond-button/diamond-button-provider";
import { BaseProvider } from "src/gameengine/gameobjects/base/base-provider";
import { DiamondProvider } from "src/gameengine/gameobjects/diamond/diamond-provider";
import { BotProvider } from "src/gameengine/gameobjects/bot/bot-provider";
import { DummyBotProvider } from "src/gameengine/gameobjects/dummy-bot/dummy-bot-provider";
import { BoardConfig } from "src/gameengine/board-config";
import { IBot } from "src/interfaces/bot.interface";
import { AbstractGameObject } from "src/gameengine/gameobjects/abstract-game-object";

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  private boards: Board[] = [];
  constructor(private logger: CustomLogger) {
    this.createInMemoryBoard();
  }
  public join(boardId: number, bot: IBot) {
    // const botExists = this.botRepository.botExists(bot);
    // if (!botExists) return error
    const board = this.boards[boardId];
    board.join(bot);
  }
  public move(
    boardId: number,
    bot: IBot,
    position: Position,
  ): AbstractGameObject[] {
    // const botExists = this.botRepository.botExists(bot);
    // if (!botExists) return error
    const board = this.boards[boardId];
    board.move(bot, position);

    return board.getAllGameObjects();
  }
  private createInMemoryBoard(): void {
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
    const board = new Board(config, providers, this.logger);
    this.boards.push(board);
  }
}
