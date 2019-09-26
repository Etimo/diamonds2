import { Controller, Get, Post, Param } from "@nestjs/common";
import { ApiUseTags, ApiCreatedResponse, ApiResponse } from "@nestjs/swagger";
import { BoardDto } from "src/models/board.dto";
import { BoardsService } from "src/services/board.service";
import { GameObjectDto } from "src/models/game-object.dto";

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
    const dto = this.boardsService.getById(id);
    return dto;
  }

  @ApiResponse({
    status: 200,
    description: "Joined specific board",
    type: BoardDto,
  })
  @ApiResponse({
    status: 404,
    description: "Board not found",
  })
  @ApiResponse({
    status: 409,
    description: "Board full",
  })
  @Post(":id/join")
  join(@Param("id") id: string): string {
    return id + "Hello2";
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
  @Post(":id/move")
  move(@Param("id") id: string): string {
    return "Hello2";
  }
}
