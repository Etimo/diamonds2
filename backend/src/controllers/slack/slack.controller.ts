import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { BoardDto } from "src/models/board.dto";
import { JoinInputDto } from "src/models/join-input.dto";
import { MoveInputDto } from "src/models/move-input.dto";
import { BoardsService } from "src/services/board.service";
import { SeasonsService } from "src/services/seasons.service";
import { BotsService } from "src/services/bots.service";
import { SeasonDto } from "src/models/season.dto";

@ApiUseTags("Slack")
@Controller("api/slack")
export class SlackController {
  constructor(
    private boardsService: BoardsService,
    private seasonsService: SeasonsService,
    botsService: BotsService,
  ) {}

  /**
   * Return all seasons.
   */
  @ApiResponse({
    status: 200,
    description: "Returns seasons",
    isArray: true,
    type: SeasonDto,
  })
  @Post("/seasons")
  async listAll(@Body() input: {}): Promise<SeasonDto[]> {
    console.log(input);
    return this.seasonsService.all();
  }
}
