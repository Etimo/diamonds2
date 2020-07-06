import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { SlackService } from "src/services/slack.service";
import * as crypto from "crypto";
import * as qs from "qs";
import UnauthorizedError from "src/errors/unauthorized.error";

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
   * Someone has interacted with a modal on slack - Returns noting if OK, slack error if an error occured
   */
  @ApiResponse({
    status: 200,
    description:
      "Inforamtion from slack that someone has interacted with a modal",
  })
  @ApiResponse({
    status: 401,
    description: "Only slack is allowed to call this endpoint.",
  })
  @Post("/interact")
  @HttpCode(200)
  async interact(@Req() request: Request, @Body() input: {}) {
    await this.validateSlackRequest(request);
    return await this.slackService.handleInteract(input);
  }

  async validateSlackRequest(request) {
    // Validating that the request was send from slack.
    const slackSigningSecret = process.env["SLACK_SIGNING_SECRET"];
    let slackSignature = request.headers["x-slack-signature"];
    let requestBody = qs.stringify(request.body, { format: "RFC1738" });
    const timestamp = request.headers["x-slack-request-timestamp"];

    const time = Math.floor(new Date().getTime() / 1000);

    // Ignore request if its older than 5 min.
    if (Math.abs(time - timestamp) > 300) {
      throw new UnauthorizedError(
        "You are not authorized to call this endpoint.",
      );
    }

    // Create my signature with request data and slackSigningSecret
    let sigBasestring = "v0:" + timestamp + ":" + requestBody;
    let mySignature =
      "v0=" +
      crypto
        .createHmac("sha256", slackSigningSecret)
        .update(sigBasestring, "utf8")
        .digest("hex");

    // Compare my signature with x-slack-signature
    if (
      !crypto.timingSafeEqual(
        Buffer.from(mySignature, "utf8"),
        Buffer.from(slackSignature, "utf8"),
      )
    ) {
      console.log("SIGNING ERROR");
      throw new UnauthorizedError(
        "You are not authorized to call this endpoint.",
      );
    }
    console.log("SIGNING OK");
  }
}
