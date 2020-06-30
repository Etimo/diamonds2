import { ApiModelProperty } from "@nestjs/swagger";

export class BaseDto {
  @ApiModelProperty()
  x: number;
  @ApiModelProperty()
  y: number;
}
