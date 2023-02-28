import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { BotRecoveryDto } from "src/models/bot-recovery.dto";
import { BotRegistrationPublicDto } from "src/models/bot-registration-public.dto";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import { BotsService } from "src/services/bots.service";

@ApiTags("Bots")
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
