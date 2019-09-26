import { ApiModelProperty } from "@nestjs/swagger";

export class GameObjectDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  position: Position;
  @ApiModelProperty()
  isBlocking: boolean;
}
