import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { BoardDto } from "src/models/board.dto";
import { JoinInputDto } from "src/models/join-input.dto";
import { MoveInputDto } from "src/models/move-input.dto";
import { BoardsService } from "src/services/board.service";

@ApiUseTags("Boards")
@Controller("api/boards")
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * Return all boards.
   */
  @ApiResponse({
    status: 200,
    isArray: true,
    description: "Return boards",
    type: BoardDto,
  })
  @Get()
  public findAll(): BoardDto[] {
    return this.boardsService.getAll();
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
    return this.boardsService.join(parseInt(id, 10), input.botToken);
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
      input.botToken,
      input.direction,
    );
  }
}
