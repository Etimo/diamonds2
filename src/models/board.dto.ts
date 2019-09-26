import { GameObjectDto } from "./game-object.dto";
import { ApiModelProperty } from "@nestjs/swagger";

export class BoardDto {
  @ApiModelProperty()
  id: string;
  @ApiModelProperty()
  width: number;
  @ApiModelProperty()
  height: number;
  @ApiModelProperty()
  minimumDelayBetweenMoves: number;
  @ApiModelProperty({ isArray: true, type: GameObjectDto })
  gameObjects: GameObjectDto[];
}
