import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  BoardDto,
  BotRecoveryDto,
  BotRegistrationDto,
  BotRegistrationPublicDto,
  JoinInputDto,
  MoveInputDto,
} from "../models";
import { BoardsService, BotsService } from "../services";
import { NotFoundError } from "../errors";

@ApiTags("Bots")
@Controller("api/bots")
export class BotsController {
  constructor(
    private botsService: BotsService,
    private boardsService: BoardsService,
  ) {}

  /**
   * Get information for a registered bot.
   *
   * @param id The secret id of the previously registered bot.
   */
  @ApiResponse({
    status: 200,
    description: "Returns bot",
    type: BotRegistrationPublicDto,
  })
  @ApiResponse({
    status: 404,
    description: "Bot not found",
  })
  @Get(":id")
  async find(@Param("id") id: string): Promise<BotRegistrationPublicDto> {
    const bot = await this.botsService.get(id);
    if (!bot) {
      throw new NotFoundError("Bot not found");
    }
    return BotRegistrationPublicDto.fromEntity(bot);
  }

  /**
   * Register a new bot.
   *
   * @param botRegistration
   */
  @ApiResponse({
    status: 200,
    description: "The bot is successfully created",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input",
  })
  @ApiResponse({
    status: 409,
    description: "The name and/or email is already taken",
  })
  @ApiOperation({
    summary: "Create new bot",
    description: "Creates a new bot and returns the secret id.",
  })
  @HttpCode(200)
  @Post()
  async create(
    @Body() botRegistration: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    const bot = await this.botsService.add(botRegistration);
    return BotRegistrationPublicDto.fromEntity(bot);
  }

  @ApiResponse({
    status: 200,
    description: "Bot was succesfully returned",
    type: BotRegistrationPublicDto,
  })
  @ApiResponse({
    status: 404,
    description: "Bot not found",
  })
  @Post("/recover")
  async recover(
    @Body() botRecoveryDto: BotRecoveryDto,
  ): Promise<BotRegistrationPublicDto> {
    const bot = await this.botsService.getByEmailAndPassword(botRecoveryDto);
    return BotRegistrationPublicDto.fromEntity(bot);
  }

  @ApiResponse({
    status: 200,
    description: "Returns the board the bot joined",
    type: BoardDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid bot id",
  })
  @ApiResponse({
    status: 409,
    description: "Board full, bot already playing or no boards available",
  })
  @ApiOperation({
    summary: "Join a board",
    description: "Try to join a board to start a new play session",
  })
  @HttpCode(200)
  @Post(":id/join")
  join(@Param("id") botId: string, @Body() input: JoinInputDto) {
    return this.boardsService.join(botId, input.preferredBoardId);
  }

  @ApiResponse({
    status: 200,
    description: "Returns the state of board after the move",
    type: BoardDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid botId",
  })
  @ApiResponse({
    status: 403,
    description: "Move not legal",
  })
  @ApiResponse({
    status: 403,
    description: "Bot not active in a game",
  })
  @ApiOperation({
    summary: "Move bot",
    description: "Perform a move for the bot on the bot's current board",
  })
  @HttpCode(200)
  @Post(":id/move")
  async move(@Param("id") botId: string, @Body() input: MoveInputDto) {
    return this.boardsService.move(botId, input.direction);
  }
}
