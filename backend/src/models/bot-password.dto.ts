import { ApiModelProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
export class BotPasswordDto {
  @ApiModelProperty({
    description: "The token of the bot you have registered",
  })
  @IsString()
  @MinLength(1)
  readonly token: string;

  @ApiModelProperty({
    description: "The new password for your bot.",
  })
  @IsString()
  @MinLength(1)
  readonly password: string;
}
