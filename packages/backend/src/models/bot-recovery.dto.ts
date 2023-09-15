import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
export class BotRecoveryDto {
  @ApiProperty({
    description: "The email of the bot you have registered",
  })
  @IsEmail()
  readonly email!: string;

  @ApiProperty({
    description: "The password for your bot.",
  })
  @IsString()
  @MinLength(1)
  readonly password!: string;
}
