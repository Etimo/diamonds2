import { ApiModelProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
export class BotDto {
  @ApiModelProperty({
    description: "The name of the bot.",
  })
  name: string;
  @ApiModelProperty({
    description: "The position of the base for this bot.",
  })
  base: PositionDto;
  @ApiModelProperty({
    description: "The current position of the bot.",
  })
  position: PositionDto;
  @ApiModelProperty({
    description: "Number of diamonds this bot is carrying.",
  })
  diamonds: number;
  @ApiModelProperty({
    description: "The time when this bot joined the board.",
  })
  timeJoined: Date;
  @ApiModelProperty({
    description:
      "The number of milliseconds left before the session ends for this bot.",
  })
  millisecondsLeft: number;
  @ApiModelProperty({
    description:
      "The value of the diamonds this bot has managed to drop of at its base.",
  })
  score: number;
  @ApiModelProperty({
    description: "An id of the bot.",
  })
  botId: string;
  @ApiModelProperty({
    description:
      "A calculated timestamp for when this bot can perform its next move.",
  })
  nextMoveAvailableAt: Date;
}
