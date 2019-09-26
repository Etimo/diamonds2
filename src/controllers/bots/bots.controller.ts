import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
  HttpException,
  NotFoundException,
} from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { BotDto } from "src/models/bot.dto";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import { BotsService } from "src/services/bots.service";
import { IBot } from "src/interfaces/bot.interface";
import { ValidationException } from "src/exceptions";
import { BotsErrors } from "src/enums/bots-errors.enum";

@ApiUseTags("Bots")
@Controller("api/bots")
export class BotsController {
  constructor(private botService: BotsService) {}
  @ApiResponse({
    status: 200,
    description: "The bot is successfully created.",
  })
  @ApiResponse({
    status: 409,
    description: "The bot already exists.",
  })
  @Post()
  async create(@Body() botRegistration: BotRegistrationDto): Promise<IBot> {
    try {
      const bot = await this.botService.add(botRegistration);
      if (!bot) {
        throw new NotFoundException();
      } else {
        return bot;
      }
    } catch (error) {
      if (this.isValidationError(error)) {
        this.throwValidationError(error);
      }
      throw error;
    }
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
  async findAll(@Param("token") token: string): Promise<IBot> {
    const bot = await this.botService.get(token);
    if (!bot) {
      throw new NotFoundException();
    }
    return bot;
  }

  private isValidationError(error: Error) {
    return error instanceof ValidationException;
  }
  private throwValidationError(error: ValidationException) {
    if (error.message === BotsErrors.AlreadyExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: "A bot with this email is already registered",
        },
        HttpStatus.CONFLICT,
      );
    }
    if (error.message === BotsErrors.InvalidEmail) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Invalid input",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
