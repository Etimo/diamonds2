import { ApiModelProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
export class BotRecoveryDto {
  @ApiModelProperty({
    description: "The email of the bot you have registered",
  })
  @IsEmail()
  readonly email: string;

  @ApiModelProperty({
    description: "The password for your bot.",
  })
  @IsString()
  @MinLength(1)
  readonly password: string;
}
