import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  BotRecoveryDto,
  BotRegistrationDto,
  BotRegistrationPublicDto,
} from "../models";
import { BotsService } from "../services";

@ApiTags("Bots")
@Controller("api/bots")
export class BotsController {
  constructor(private botService: BotsService) {}

  /**
   * Get information for a registered bot.
   *
   * @param id The secret id of the previously registered bot.
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
  @Get(":id")
  async find(@Param("id") id: string): Promise<BotRegistrationPublicDto> {
    const bot = await this.botService.get(id);
    return BotRegistrationPublicDto.fromEntity(bot);
  }

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
    const bot = await this.botService.add(botRegistration);
    return BotRegistrationPublicDto.fromEntity(bot);
  }

  @ApiResponse({
    status: 200,
    description: "Bot was succesfully returned",
    type: BotRegistrationPublicDto,
  })
  @ApiResponse({
    status: 404,
    description: "Bot not found",
  })
  @Post("/recover")
  async recover(
    @Body() botRecoveryDto: BotRecoveryDto,
  ): Promise<BotRegistrationPublicDto> {
    const bot = await this.botService.getByEmailAndPassword(botRecoveryDto);
    return BotRegistrationPublicDto.fromEntity(bot);
  }
}
