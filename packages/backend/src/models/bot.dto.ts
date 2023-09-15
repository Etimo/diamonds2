import { ApiProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
export class BotDto {
  @ApiProperty({
    description: "The name of the bot.",
  })
  name!: string;
  @ApiProperty({
    description: "The position of the base for this bot.",
  })
  base!: PositionDto;
  @ApiProperty({
    description: "The current position of the bot.",
  })
  position!: PositionDto;
  @ApiProperty({
    description: "Number of diamonds this bot is carrying.",
  })
  diamonds!: number;
  @ApiProperty({
    description: "The time when this bot joined the board.",
  })
  timeJoined!: Date;
  @ApiProperty({
    description:
      "The number of milliseconds left before the session ends for this bot.",
  })
  millisecondsLeft!: number;
  @ApiProperty({
    description:
      "The value of the diamonds this bot has managed to drop of at its base.",
  })
  score!: number;
  @ApiProperty({
    description: "An id of the bot.",
  })
  botId!: string;
  @ApiProperty({
    description:
      "A calculated timestamp for when this bot can perform its next move.",
  })
  nextMoveAvailableAt!: Date;
}
