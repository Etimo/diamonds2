import { Controller, Post, Get, Param, Body, HttpCode } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { BotDto } from "src/models/bot.dto";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import { BotsService } from "src/services/bots.service";
import { IBot } from "src/interfaces/bot.interface";
import { BotRegistrationPublicDto } from "src/models/bot-registration-public.dto";

@ApiUseTags("Bots")
@Controller("api/bots")
export class BotsController {
  constructor(private botService: BotsService) {}

  /**
   * Register a new bot.
   *
   * @param botRegistration
   */
  @ApiResponse({
    status: 200,
    description: "The bot is successfully created",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input",
  })
  @ApiResponse({
    status: 409,
    description: "The name and/or email is already taken",
  })
  @HttpCode(200)
  @Post()
  async create(
    @Body() botRegistration: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    return await this.botService.add(botRegistration);
  }

  /**
   * Get information for a registered bot.
   *
   * @param token The secret token of the previously registered bot.
   */
  @ApiResponse({
    status: 200,
    description: "Returns bot",
    type: BotRegistrationPublicDto,
  })
  @ApiResponse({
    status: 404,
    description: "Bot not found",
  })
  @Get(":token")
  async find(@Param("token") token: string): Promise<BotRegistrationPublicDto> {
    return await this.botService.get(token);
  }
}
