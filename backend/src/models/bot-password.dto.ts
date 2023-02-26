import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
export class BotPasswordDto {
  @ApiProperty({
    description: "The token of the bot you have registered",
  })
  @IsString()
  @MinLength(1)
  readonly token: string;

  @ApiProperty({
    description: "The new password for your bot.",
  })
  @IsString()
  @MinLength(1)
  readonly password: string;
}
