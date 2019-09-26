import { ApiModelProperty } from "@nestjs/swagger";
import { SeasonDto } from "./season.dto";

export class HighscoreDto {
  @ApiModelProperty()
  botName: string;
  @ApiModelProperty()
  score: number;
  @ApiModelProperty({
    example: "2019-09-26T12:30:45.012Z",
  })
  sessionFinishedAt: Date;
  @ApiModelProperty()
  season: SeasonDto;
}
