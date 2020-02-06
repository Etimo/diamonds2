import { ApiModelProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
export class BotDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  base: PositionDto;
  @ApiModelProperty()
  position: PositionDto;
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
