import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  BoardDto,
  BoardMetadataDto,
  JoinInputDto,
  MoveInputDto,
} from "../models";
import { BoardsService } from "../services";

@ApiTags("Boards")
@Controller("api/boards")
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * Return all boards.
   */
  @ApiResponse({
    status: 200,
    isArray: true,
    description: "Return all boards",
    type: BoardMetadataDto,
  })
  @Get()
  public findAll(): BoardMetadataDto[] {
    return this.boardsService.getAllMetadata();
  }

  /**
   * Return a specific board.
   *
   * @param id The id of the board.
   */
  @ApiResponse({
    status: 200,
    description: "Returns specific board",
    type: BoardDto,
  })
  @ApiResponse({
    status: 404,
    description: "Board not found",
  })
  @Get(":id")
  public find(@Param("id") id: string): BoardDto {
    return this.boardsService.getById(parseInt(id, 10));
  }

  /**
   * Join a board to start a new playing session.
   *
   * @param id The id of the board.
   * @param input
   */
  @ApiResponse({
    status: 200,
    description: "Joined specific board",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid botToken",
  })
  @ApiResponse({
    status: 404,
    description: "Board not found",
  })
  @ApiResponse({
    status: 409,
    description: "Board full",
  })
  @HttpCode(200)
  @Post(":id/join")
  join(@Param("id") id: string, @Body() input: JoinInputDto) {
    return this.boardsService.join(parseInt(id, 10), input.botId);
  }

  /**
   * Perform a move for a bot on a board.
   *
   * @param id The id of the board
   * @param input
   */
  @ApiResponse({
    status: 200,
    description: "Returns specific board",
    type: BoardDto,
  })
  @ApiResponse({
    status: 401,
    description: "Invalid botToken",
  })
  @ApiResponse({
    status: 403,
    description: "Move not legal",
  })
  @ApiResponse({
    status: 404,
    description: "Board not found",
  })
  @HttpCode(200)
  @Post(":id/move")
  async move(@Param("id") id: string, @Body() input: MoveInputDto) {
    return this.boardsService.move(
      parseInt(id, 10),
      input.botId,
      input.direction,
    );
  }
}
