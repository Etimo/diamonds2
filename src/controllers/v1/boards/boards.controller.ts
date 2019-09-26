import { Controller, Get, Post, Param } from "@nestjs/common";
import { ApiUseTags, ApiCreatedResponse, ApiResponse } from "@nestjs/swagger";
import { BoardDto } from "src/models/board.dto";

@ApiUseTags("Boards")
@Controller("api/boards")
export class BoardsController {
  @ApiResponse({
    status: 200,
    isArray: true,
    description: "Returns boards",
    type: BoardDto,
  })
  @ApiResponse({
    status: 404,
    description: "Board not found",
  })
  @Get()
  public async findAll(): Promise<BoardDto[]> {
    return [];
  }
  @ApiResponse({
    status: 200,
    description: "Returns boards",
    type: BoardDto,
  })
  @ApiResponse({
    status: 404,
    description: "Board not found",
  })
  @Get(":id")
  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: BoardDto,
  })
  public async find(@Param("id") id: string): Promise<BoardDto> {
    return null;
  }
  @Post(":id/join")
  join(@Param("id") id: string): string {
    return id + "Hello2";
  }
  @Post(":id/move")
  move(@Param("id") id: string): string {
    return "Hello2";
  }
}
