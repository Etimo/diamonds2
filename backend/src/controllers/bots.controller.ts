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
    return {
      name: bot.name,
      email: bot.email,
      id: bot.id,
    };
  }

  // /**
  //  * Get information for a registered bot.
  //  *
  //  * @param token The secret token of the previously registered bot.
  //  */
  // @ApiResponse({
  //   status: 200,
  //   description: "Returns bot",
  //   type: BotRegistrationPublicDto,
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "Bot not found",
  // })
  // @Get(":token")
  // async find(@Param("token") token: string): Promise<BotRegistrationPublicDto> {
  //   return await this.botService.get(token);
  // }

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
    return {
      email: bot.email,
      id: bot.id,
      name: bot.name,
    };
  }

  // @ApiResponse({
  //   status: 200,
  //   description: "Password was succesfully added, returning bot",
  //   type: BotRegistrationPublicDto,
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: "Not allowed to change password if a password already exists",
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: "Bot not found",
  // })
  // @Post("/password")
  // async addPassword(
  //   @Body() botPasswordDto: BotPasswordDto,
  // ): Promise<BotRegistrationPublicDto> {
  //   return await this.botService.addPassword(botPasswordDto);
  // }
}
