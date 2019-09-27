import { ApiModelProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
import { IsEmail, IsString, Min, Max } from "class-validator";
export class BotRegistrationDto {
  @ApiModelProperty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  @Min(1)
  @Max(10)
  readonly name: string;
}
