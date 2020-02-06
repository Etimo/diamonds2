import { ApiModelProperty } from "@nestjs/swagger";

export class HighscoreDto {
  @ApiModelProperty()
  botName: string;
  @ApiModelProperty()
  score: number;
}
