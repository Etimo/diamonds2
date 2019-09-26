import { BaseDto } from "./base.dto";
import { ApiModelProperty } from "@nestjs/swagger";
export class BotDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  base: BaseDto;
  @ApiModelProperty()
  position: Position;
  @ApiModelProperty()
  diamonds: number;
  @ApiModelProperty()
  timeJoined: Date;
  @ApiModelProperty()
  millisecondsLeft: number;
  @ApiModelProperty()
  score: number;
  @ApiModelProperty()
  botId: string;
  @ApiModelProperty()
  nextMoveAvailableAt: Date;
}
