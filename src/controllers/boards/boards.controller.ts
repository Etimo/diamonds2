import { Controller, Get, Post, Param, Body, HttpCode } from "@nestjs/common";
import { ApiUseTags, ApiCreatedResponse, ApiResponse } from "@nestjs/swagger";
import { BoardDto } from "src/models/board.dto";
import { BoardsService } from "src/services/board.service";
import { GameObjectDto } from "src/models/game-object.dto";
import { JoinInputDto } from "src/models/join-input.dto";
import { MoveInputDto } from "src/models/move-input.dto";

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
    return this.boardsService.getById(id);
  }

  @ApiResponse({
    status: 200,
    description: "Joined specific board",
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
    return this.boardsService.join(id, input.botToken);
  }

  @ApiResponse({
    status: 200,
    description: "Returns specific board",
    type: BoardDto,
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
    return this.boardsService.move(id, input.botToken, input.direction);
  }
}
