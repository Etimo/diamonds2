import { Position } from "@etimo/diamonds2-types";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { MoveDirection } from "../enums";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";
import {
  BaseProvider,
  Board,
  BotGameObject,
  BotProvider,
  DiamondButtonProvider,
  DiamondProvider,
  DummyBotProvider,
  OperationQueueBoard,
  TeleportProvider,
  TeleportRelocationProvider,
} from "../gameengine";
import { CustomLogger } from "../logger";
import { BoardDto, BoardMetadataDto, GameObjectDto } from "../models";
import { IBoardConfig, IBot } from "../types";
import { BoardConfigService } from "./board-config.service";
import { BotsService } from "./bots.service";
import { HighscoresService } from "./highscores.service";
import { RecordingsService } from "./recordings.service";
import { SeasonsService } from "./seasons.service";
@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  private static nextBoardId = 1;
  private boards: OperationQueueBoard[] = [];
  private ephemeralBoards: OperationQueueBoard[] = [];

  constructor(
    private botsService: BotsService,
    private seasonsService: SeasonsService,
    private recordingsService: RecordingsService,
    private boardConfigService: BoardConfigService,
    private highscoresService: HighscoresService,
    private logger: CustomLogger,
    @Inject("NUMBER_OF_BOARDS") numberOfBoards: number,
    @Inject("MAX_EPHEMERAL_BOARDS") numEphemeralBoards: number,
  ) {
    this.initialize(numberOfBoards, numEphemeralBoards).then(() => {
      logger.info("Boards initialized");
    });

    // We reset id whenever this service is reinitialized
    BoardsService.nextBoardId = 1;
  }

  private async initialize(numberOfBoards: number, numEphemeralBoards: number) {
    const boardConfig = await this.boardConfigService.getCurrentBoardConfig();
    if (!boardConfig) {
      throw new Error("No board config found");
    }

    this.boards = await this.createInMemoryBoards(numberOfBoards, boardConfig);
    this.ephemeralBoards = await this.createInMemoryBoards(
      numEphemeralBoards,
      boardConfig,
    );

    const fixBoard = (board: OperationQueueBoard) =>
      board.registerSessionFinishedCallback(async (bot: BotGameObject) => {
        const currentSeason = await this.seasonsService.getCurrentSeason();
        const better = await this.highscoresService.addOrUpdate({
          score: bot.score,
          seasonId: currentSeason!.id,
          botId: bot.botId,
        });
        if (better) {
          this.recordingsService.save({
            board: board.getId(),
            botId: bot.botId,
            score: bot.score,
            seasonId: currentSeason!.id,
          });
        }
      });

    this.boards.forEach(fixBoard);
    this.logger.info(`${numberOfBoards} Live board(s) initialized`);
    this.ephemeralBoards.forEach(fixBoard);
    this.logger.info(`${numEphemeralBoards} Ephmeral board(s) initialized`);

    if (this.recordingsService) {
      const sessionLength = boardConfig.sessionLength;
      const minimumDelayBetweenMoves = boardConfig.minimumDelayBetweenMoves;
      const extraFactor = 1.5;
      const maxMoves =
        (1000 / minimumDelayBetweenMoves) * sessionLength * extraFactor;
      this.recordingsService.setup(
        numberOfBoards + numEphemeralBoards,
        maxMoves,
      );
    }
  }

  private _getAllBoards(): OperationQueueBoard[] {
    return [...this.boards, ...this.ephemeralBoards];
  }

  /**
   * Return all boards.
   */
  public getAll(): BoardDto[] {
    return this._getAllBoards().map((b) => this.getAsDto(b));
  }

  public getAllMetadata(): BoardMetadataDto[] {
    return this._getAllBoards().map((b) => this.getAsMetadataDto(b));
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
   * @param preferredBoardId
   * @param bot
   */
  public async join(botId: string, preferredBoardId?: number) {
    // Check if bot exists
    const bot = await this.botsService.get(botId);
    if (!bot) {
      throw new UnauthorizedError("Invalid bot");
    }

    // Check if bot is on any board
    this._getAllBoards().forEach((b) => {
      if (b.getBotById(botId)) {
        throw new ConflictError("Already playing");
      }
    });

    const boardConfig = await this.boardConfigService.getCurrentBoardConfig();
    let board: OperationQueueBoard | undefined;
    if (boardConfig?.separateBoards) {
      // Ephemeral boards should only be used by one bot at a time so we accept no other bots
      this.logger.debug("Find ephemeral board");
      board = this.ephemeralBoards.find((board) => {
        console.log(board.getBotsCount());
        return board.getBotsCount() === 0;
      });
      if (!board) {
        throw new ConflictError("No board available");
      }
    } else {
      // Join a live board
      board = this.getBoardById(preferredBoardId!);

      // TODO: join another board
    }

    if (!board) {
      throw new ConflictError("Board not found");
    }

    // Try to join
    const result = await board.enqueueJoin(bot);
    if (!result) {
      throw new ConflictError("Board full");
    }
    return this.returnAndSaveDto(board);
  }

  private returnAndSaveDto(board: Board) {
    const dto = this.getAsDto(board);
    const index = this._getAllBoards().findIndex(
      (b) => b.getId() === board.getId(),
    );
    if (this.recordingsService) this.recordingsService.record(index, dto);
    return dto;
  }

  public async move(botId: string, direction: MoveDirection) {
    // Get board where the bot is located
    const board = this.getBoardFromBotId(botId);
    if (!board) {
      throw new ForbiddenError("Bot is not playing on a board");
    }

    // Get bot to move from board
    const bot = board.getBotById(botId);
    if (!bot) {
      throw new UnauthorizedError("Invalid botId");
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

  private getBoardById(id: number): OperationQueueBoard | undefined {
    return this._getAllBoards().find((b) => b.getId() === id);
  }

  private getBoardFromBotId(botId: string): OperationQueueBoard | undefined {
    return this._getAllBoards().find((b) => b.getBotById(botId));
  }

  /**
   * Convert a MoveDirection enum to a delta Position.
   * @param direction
   */
  private directionToDelta(direction: MoveDirection): Position {
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
      features: board.gameObjectProviders.map((gop) => {
        return {
          name: gop.constructor.name,
          config: gop.config,
        };
      }),
      gameObjects: board.getAllGameObjects().map((g) => {
        return {
          id: g.id,
          position: g.position,
          type: g.constructor.name,
          properties: g.properties,
        } as GameObjectDto;
      }),
    };
  }

  private getAsMetadataDto(board: Board): BoardMetadataDto {
    return {
      id: board.getId(),
      width: board.width,
      height: board.height,
      minimumDelayBetweenMoves: board.getConfig().minimumDelayBetweenMoves,
      features: board.gameObjectProviders.map((gop) => {
        return {
          name: gop.constructor.name,
          config: gop.config,
        };
      }),
    };
  }

  /**
   * Create an example board for debugging purpose.
   */
  public async createInMemoryBoards(
    numberOfBoards: number,
    boardConfig: IBoardConfig,
  ): Promise<OperationQueueBoard[]> {
    const providers = [
      new DiamondButtonProvider(),
      new BaseProvider(),
      new DiamondProvider({
        generationRatio: 0.1,
        minRatioForGeneration: 0.01,
        redRatio: 0.2,
      }),
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
    if (boardConfig.dummyBots) {
      providers.push(
        new DummyBotProvider({
          canTackle: boardConfig.canTackle,
          inventorySize: boardConfig.inventorySize,
          count: boardConfig.dummyBots,
          prefix: "Dummy",
        }),
      );
    }

    const ret: OperationQueueBoard[] = [];
    for (let i = 0; i < numberOfBoards; i++) {
      const board = new OperationQueueBoard(
        BoardsService.nextBoardId++,
        boardConfig,
        providers,
        this.logger,
      );
      ret.push(board);
    }
    return ret;
  }

  private tooManyRateLimitViolations(board: OperationQueueBoard, bot: IBot) {
    return board.getRateLimitViolations(bot) > 10;
  }
}
