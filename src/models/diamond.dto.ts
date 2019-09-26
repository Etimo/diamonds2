import { ApiModelProperty } from "@nestjs/swagger";

export class DiamondDto {
  @ApiModelProperty()
  points: number;
  @ApiModelProperty()
  x: number;
  @ApiModelProperty()
  y: number;
}
