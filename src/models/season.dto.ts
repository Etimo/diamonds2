import { ApiModelProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class SeasonDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty({
    example: "2019-09-26T12:30:45.012Z",
  })
  @IsDateString()
  endsAt: Date;
}
