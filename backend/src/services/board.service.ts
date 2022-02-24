import { Injectable, Scope, Logger, Inject } from "@nestjs/common";
import { OperationQueueBoard } from "../gameengine/operation-queue-board";
import { BotsService } from "./bots.service";
import { HighScoresService } from "./high-scores.service";
import { CustomLogger } from "../logger";
import { BoardDto } from "../models/board.dto";
import NotFoundError from "../errors/not-found.error";
import UnauthorizedError from "../errors/unauthorized.error";
import ConflictError from "../errors/conflict.error";
import { MoveDirection } from "../enums/move-direction.enum";
import ForbiddenError from "../errors/forbidden.error";
import { IBot } from "../interfaces/bot.interface";
import { IPosition } from "../common/interfaces/position.interface";
import { Board } from "../gameengine/board";
import { GameObjectDto } from "../models/game-object.dto";
import { DiamondButtonProvider } from "../gameengine/gameobjects/diamond-button/diamond-button-provider";
import { BaseProvider } from "../gameengine/gameobjects/base/base-provider";
import { DiamondProvider } from "../gameengine/gameobjects/diamond/diamond-provider";
import { BotProvider } from "../gameengine/gameobjects/bot/bot-provider";
import { BoardConfig } from "../gameengine/board-config";
import { TeleportProvider } from "../gameengine/gameobjects/teleport/teleport-provider";
import { MetricsService } from "./metrics.service";
import { TeleportRelocationProvider } from "../gameengine/gameobjects/teleport-relocation-provider/teleport-relocation-provider";
import { SeasonsService } from "./seasons.service";
import { RecordingsService } from "./recordings.service";
import { BoardConfigService } from "./board-config.service";
import { BoardConfigDto } from "src/models/board-config.dto";

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  private boards: OperationQueueBoard[] = [];

  constructor(
    private botsService: BotsService,
    private highscoresService: HighScoresService,
    private metricsService: MetricsService,
    private seasonsService: SeasonsService,
    private recordingsService: RecordingsService,
    private boardConfigService: BoardConfigService,
    private logger: CustomLogger,
    @Inject("NUMBER_OF_BOARDS") private numberOfBoards,
  ) {
    this.createInMemoryBoards(this.numberOfBoards).then(async () => {
      this.boards.forEach(board => {
        board.registerSessionFinishedCallback(
          async (botName: any, score: any) => {
            if (this.metricsService) {
              this.metricsService.decPlayersTotal(board.getId());
            }
            const currentSeason = await this.seasonsService.getCurrentSeason();
            const better = await this.highscoresService.addOrUpdate({
              botName,
              score,
              seasonId: currentSeason.id,
            });
            if (better) {
              this.recordingsService.save({
                boardIndex: this.getBoardIndex(board),
                botName,
                score,
                seasonId: currentSeason.id,
              });
            }
          },
        );
      });
    });
  }

  /**
   * Return all boards.
   */
  public getAll(): BoardDto[] {
    return this.boards.map(b => this.getAsDto(b));
  }

  /**
   * Return a specific board.
   * @param id The id of the board to return.
   */
  public getById(id: number): BoardDto {
    const board = this.getBoardById(id);
    if (board) {
      return this.returnAndSaveDto(board);
    }
    throw new NotFoundError("Board not found");
  }

  /**
   *
   * @param boardId
   * @param bot
   */
  public async join(boardId: number, botToken: string) {
    const bot = await this.botsService.get(botToken);
    if (!bot) {
      throw new UnauthorizedError("Invalid botToken");
    }
    const board = this.getBoardById(boardId);
    if (!board) {
      throw new NotFoundError("Board not found");
    }

    // Check if bot is on any board
    this.boards.forEach(b => {
      if (b.getBot(botToken)) {
        throw new ConflictError("Already playing");
      }
    });

    const result = await board.enqueueJoin(bot);
    if (!result) {
      throw new ConflictError("Board full");
    }
    if (this.metricsService) {
      this.metricsService.incPlayersTotal(boardId);
      this.metricsService.incSessionsStarted(boardId);
    }
    return this.returnAndSaveDto(board);
  }

  private returnAndSaveDto(board: Board) {
    const dto = this.getAsDto(board);
    const index = this.getBoardIndex(board);
    if (this.recordingsService) this.recordingsService.record(index, dto);
    return dto;
  }

  public async move(
    boardId: number,
    botToken: string,
    direction: MoveDirection,
  ) {
    // Get board to move on
    const board = this.getBoardById(boardId);
    if (!board) {
      throw new NotFoundError("Board not found");
    }

    // Get bot to move from board
    let bot = board.getBot(botToken);
    if (!bot) {
      throw new UnauthorizedError("Invalid botToken");
    }

    // Rate limit moves
    if (this.moveIsRateLimited(board, bot)) {
      if (this.tooManyRateLimitViolations(board, bot)) {
        await board.removeBot(bot, 1);
        throw new ConflictError(
          `You have been removed from the board due to more then 10 rate limit violations.`,
        );
      }
      const delay = board.getConfig().minimumDelayBetweenMoves;
      throw new ConflictError(`Minimum delay between moves: (${delay} ms`);
    }
    board.updateLastMove(bot);

    const result = await board.enqueueMove(
      bot,
      this.directionToDelta(direction),
    );

    if (!result) {
      throw new ForbiddenError("Move not legal");
    }

    if (this.metricsService) {
      this.metricsService.incMovesPerformed(boardId);
    }

    return this.returnAndSaveDto(board);
  }

  private moveIsRateLimited(board: OperationQueueBoard, bot: IBot) {
    const lastMove = board.getLastMove(bot);
    const timeBetweenMoves = board.getConfig().minimumDelayBetweenMoves;
    const now = Date.now();
    const violation = lastMove > now - timeBetweenMoves;
    if (violation) {
      board.updateRateLimitViolations(bot);
    }
    return violation;
  }

  private getBoardById(id: number): OperationQueueBoard {
    return this.boards.find(b => b.getId() === id);
  }

  private getBoardIndex(board: Board): number {
    return this.boards.findIndex(b => b === board);
  }

  /**
   * Convert a MoveDirection enum to a delta IPosition.
   * @param direction
   */
  private directionToDelta(direction: MoveDirection): IPosition {
    switch (direction) {
      case MoveDirection.NORTH:
        return { x: 0, y: -1 };
      case MoveDirection.SOUTH:
        return { x: 0, y: 1 };
      case MoveDirection.WEST:
        return { x: -1, y: 0 };
      case MoveDirection.EAST:
        return { x: 1, y: 0 };
      default:
        throw Error();
    }
  }

  /**
   * Convert a board to a dto.
   * @param board
   */
  private getAsDto(board: Board): BoardDto {
    return {
      id: board.getId(),
      width: board.width,
      height: board.height,
      minimumDelayBetweenMoves: board.getConfig().minimumDelayBetweenMoves,
      features: board.gameObjectProviders.map(gop => {
        return {
          name: gop.constructor.name,
          config: gop.config,
        };
      }),
      gameObjects: board.getAllGameObjects().map(g => {
        return {
          id: g.id,
          position: g.position,
          type: g.constructor.name,
          properties: g.properties,
        } as GameObjectDto;
      }),
    };
  }

  /**
   * Create an example board for debugging purpose.
   */
  public async createInMemoryBoards(numberOfBoards: number): Promise<void> {
    const boardConfig = await this.boardConfigService.getCurrentBoardConfig();
    const providers = [
      new DiamondButtonProvider(),
      new BaseProvider(),
      new DiamondProvider({
        generationRatio: 0.1,
        minRatioForGeneration: 0.01,
        redRatio: 0.2,
      }),
      // new DummyBotProvider({
      //   inventorySize: 5,
      // }),
      new BotProvider({
        inventorySize: boardConfig.inventorySize,
        canTackle: boardConfig.canTackle,
      }),
      new TeleportProvider({
        pairs: boardConfig.teleporters,
      }),
      new TeleportRelocationProvider({
        seconds: boardConfig.teleportRelocation,
      }),
    ];
    const sessionLength = boardConfig.sessionLength;
    const minimumDelayBetweenMoves = boardConfig.minimumDelayBetweenMoves;
    if (this.recordingsService) {
      const extraFactor = 1.5;
      const maxMoves =
        (1000 / minimumDelayBetweenMoves) * sessionLength * extraFactor;
      this.recordingsService.setup(numberOfBoards, maxMoves);
    }

    for (let i = 0; i < numberOfBoards; i++) {
      const config: BoardConfig = {
        height: boardConfig.height,
        width: boardConfig.width,
        minimumDelayBetweenMoves,
        sessionLength,
      };
      const board = new OperationQueueBoard(
        this.getNextBoardId(),
        config,
        providers,
        this.logger,
      );
      this.boards.push(board);
      if (this.metricsService) {
        this.metricsService.incBoardsTotal();
      }
    }
  }

  public removeEmptyBoards(numberOfBoards: number) {
    // Fetches empty boards (No bot playing).
    // Removing X number of boards that are empty.
    const removeIndex = [];
    this.boards.forEach((board, index) => {
      if (Object.keys(board.getBots()).length === 0) {
        // Do not remove board 1
        if (board.getId() != 1) {
          removeIndex.push(index);
        }
      }
    });

    // Read backwards (Removing the higher ids first)
    removeIndex
      .slice()
      .reverse()
      .forEach((removeIndex, index) => {
        if (index < numberOfBoards) {
          this.boards.splice(removeIndex, 1);
          if (this.metricsService) {
            this.metricsService.decBoardsTotal();
          }
        }
      });
  }

  private getNextBoardId() {
    // Fetch the highest board id
    // Returns 1 if no boards are created yet.
    if (this.boards.length === 0) {
      return 1;
    }
    const highestId = Math.max.apply(
      Math,
      this.boards.map(function(board) {
        return board.getId();
      }),
    );
    return highestId + 1;
  }

  private tooManyRateLimitViolations(board: OperationQueueBoard, bot: IBot) {
    return board.getRateLimitViolations(bot) > 10;
  }
}
