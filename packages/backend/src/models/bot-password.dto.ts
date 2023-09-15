import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
export class BotPasswordDto {
  //TODO: Remove if not used //Klara

  @ApiProperty({
    description: "The id of the bot you have registered",
  })
  @IsString()
  @MinLength(1)
  readonly id!: string;

  @ApiProperty({
    description: "The new password for your bot.",
  })
  @IsString()
  @MinLength(1)
  readonly password!: string;
}
