import { GameObjectDto } from "./game-object.dto";
import { BotDto } from "./bot.dto";
import { DiamondDto } from "./diamond.dto";
import { ApiModelProperty } from "@nestjs/swagger";

export class BoardDto {
  @ApiModelProperty()
  gameObjects: GameObjectDto[];
  @ApiModelProperty()
  id: string;
  @ApiModelProperty()
  width: number;
  @ApiModelProperty()
  height: number;
  @ApiModelProperty()
  bots: BotDto[];
  @ApiModelProperty()
  diamonds: DiamondDto[];
  @ApiModelProperty()
  minimumDelayBetweenMoves: number;
}
