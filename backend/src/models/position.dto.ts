import { ApiModelProperty } from "@nestjs/swagger";

export class PositionDto {
  @ApiModelProperty({
    description: "The x position on the board.",
  })
  x: number;
  @ApiModelProperty({
    description: "The y position on the board.",
  })
  y: number;
}
