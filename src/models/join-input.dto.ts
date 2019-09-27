import { ApiModelProperty } from "@nestjs/swagger";

export class JoinInputDto {
  @ApiModelProperty()
  botToken: string;
}
