import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  NotContains,
} from "class-validator";
export class BotRegistrationDto {
  @ApiProperty({
    description:
      "A valid email address for this bot. Will be used for communication. Will for example be used if you are one of the winners.",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "The name you want to use for the bot.",
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  @NotContains(" ", { message: "Bot name can not contain whitespace" })
  name!: string;

  @ApiProperty({
    description: "The password for your bot (Old bots don't have a password).",
  })
  @IsString()
  password!: string;

  @ApiProperty({
    description: "The abbreviation of the team you want to join.",
  })
  team!: string;
}
