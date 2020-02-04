import { ApiModelProperty } from "@nestjs/swagger";

export default class BoardFeatureDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  config: Object;
}
