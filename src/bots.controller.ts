import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  ConflictException,
} from "@nestjs/common";
import { CreateBotDto } from "./interfaces/create-bot-input.interface";
import { IBot } from "./interfaces/bot.interface";
import { BotsService } from "./services/bots.service";
import { ValidationException } from "./exceptions";

@Controller("bots")
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post()
  async create(@Body() input: CreateBotDto) {
    return this.botsService.add(input);
  }

  @Get()
  async findAll(): Promise<IBot[]> {
    return this.botsService.all();
  }
}
