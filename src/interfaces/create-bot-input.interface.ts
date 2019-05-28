import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";

export class CreateBotDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  email: string;
}
