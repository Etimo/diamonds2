import { ApiModelProperty } from "@nestjs/swagger";

export class DiamondDto {
  @ApiModelProperty({
    description:
      "The value this diamond is worth. Also the number of spaces it takes in an inventory.",
  })
  points: number;
  @ApiModelProperty()
  x: number;
  @ApiModelProperty()
  y: number;
}
