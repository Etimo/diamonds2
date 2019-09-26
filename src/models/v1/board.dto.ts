import { GameObjectDto } from "./game-object.dto";
import { BotDto } from "./bot.dto";
import { DiamondDto } from "./diamond.dto";
import { ApiModelProperty } from "@nestjs/swagger";

export class BoardDto {
  @ApiModelProperty({
    type: GameObjectDto,
    isArray: true,
  })
  gameObjects: GameObjectDto[];
  @ApiModelProperty()
  id: string;
  @ApiModelProperty()
  width: number;
  @ApiModelProperty()
  height: number;
  @ApiModelProperty({
    type: BotDto,
    isArray: true,
  })
  bots: BotDto[];
  @ApiModelProperty({
    type: DiamondDto,
    isArray: true,
  })
  diamonds: DiamondDto[];
  @ApiModelProperty()
  minimumDelayBetweenMoves: number;
}
