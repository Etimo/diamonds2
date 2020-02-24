import { ApiModelProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
import {
  IsEmail,
  IsString,
  Min,
  Max,
  MinLength,
  MaxLength,
} from "class-validator";
export class BotRegistrationDto {
  @ApiModelProperty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  readonly botName: string;
}
