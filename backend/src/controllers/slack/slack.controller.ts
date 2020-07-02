import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { BoardDto } from "src/models/board.dto";
import { JoinInputDto } from "src/models/join-input.dto";
import { MoveInputDto } from "src/models/move-input.dto";
import { BoardsService } from "src/services/board.service";
import { SeasonsService } from "src/services/seasons.service";
import { BotsService } from "src/services/bots.service";
import { SeasonDto } from "src/models/season.dto";
import { SlackService } from "src/services/slack.service";

@ApiUseTags("Slack")
@Controller("api/slack")
export class SlackController {
  constructor(private slackServide: SlackService) {}

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
  @HttpCode(200)
  async listAll(@Body() input: {}) {
    return this.slackServide.getAllSeasons(input);
  }
}
