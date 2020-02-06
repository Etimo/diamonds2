import { ApiModelProperty } from "@nestjs/swagger";

export class PositionDto {
  @ApiModelProperty()
  x: number;
  @ApiModelProperty()
  y: number;
}
