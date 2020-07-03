import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { SlackService } from "src/services/slack.service";

@ApiUseTags("Slack")
@Controller("api/slack")
export class SlackController {
  constructor(private slackService: SlackService) {}

  /**
   * Return all seasons in a slack modal.
   */
  @ApiResponse({
    status: 200,
    description: "Shows a slack modal with all seasons",
  })
  @Post("/seasons")
  @HttpCode(200)
  async listAll(@Body() input: {}) {
    return this.slackService.getAllSeasons(input);
  }

  /**
   * Return a slack modal to add seasons
   */
  @ApiResponse({
    status: 200,
    description: "Shows a slack modal to add seasons",
  })
  @Post("/season")
  @HttpCode(200)
  async addSeasonModal(@Body() input: {}) {
    return await this.slackService.getSeasonModal(input);
  }

  /**
   * Someone has interacted with a modal on slack - Returns OK/ERROR
   */
  @ApiResponse({
    status: 200,
    description:
      "Inforamtion from slack that someone has interacted with a modal",
  })
  @Post("/interact")
  @HttpCode(200)
  async interact(@Body() input: {}) {
    console.log("INTERACT1");
    console.log(input);
    return await this.slackService.handleInteract(input);
  }
}
