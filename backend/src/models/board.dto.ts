import { ApiModelProperty } from "@nestjs/swagger";
import BoardFeatureDto from "./board-feature.dto";
import { GameObjectDto } from "./game-object.dto";

export class BoardDto {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  width: number;
  @ApiModelProperty()
  height: number;
  @ApiModelProperty()
  minimumDelayBetweenMoves: number;
  @ApiModelProperty({ isArray: true, type: GameObjectDto })
  gameObjects: GameObjectDto[];
  @ApiModelProperty()
  features: BoardFeatureDto[];
}
