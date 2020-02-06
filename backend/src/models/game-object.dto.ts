import { ApiModelProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";

export class GameObjectDto {
  @ApiModelProperty()
  type: string;
  @ApiModelProperty()
  position: PositionDto;
  @ApiModelProperty()
  properties: object;
}
