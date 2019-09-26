import { Controller, Post, Get, Param } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { BotDto } from "src/models/v1/bot.dto";

@ApiUseTags("Bots")
@Controller("api/bots")
export class BotsController {
  @ApiResponse({
    status: 200,
    description: "The bot is successfully created.",
  })
  @ApiResponse({
    status: 409,
    description: "The bot already exists.",
  })
  @Post()
  async create(): Promise<void> {
    return;
  }

  @ApiResponse({
    status: 200,
    description: "Returns bot",
    type: BotDto,
  })
  @ApiResponse({
    status: 404,
    description: "Bot not found",
  })
  @Get(":token")
  async findAll(@Param("token") token: string): Promise<BotDto> {
    return {} as BotDto;
  }
}
