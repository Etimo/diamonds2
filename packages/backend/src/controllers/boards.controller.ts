import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BoardDto, BoardMetadataDto } from "../models";
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
  @ApiOperation({
    summary: "List metadata for all boards",
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
  @ApiOperation({
    summary: "Get info about a board",
    description: "Get metadata and full info about a board and its game state",
  })
  @Get(":id")
  public find(@Param("id") id: string): BoardDto {
    return this.boardsService.getById(parseInt(id, 10));
  }
}
