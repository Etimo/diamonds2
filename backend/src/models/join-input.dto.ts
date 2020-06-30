import { ApiModelProperty } from "@nestjs/swagger";

export class JoinInputDto {
  @ApiModelProperty({
    description: "The secret token of the bot that you want to join with.",
  })
  botToken: string;
}
