import { ApiProperty } from "@nestjs/swagger";

export class JoinInputDto {
  @ApiProperty({
    description: "The id of the bot that you want to join with.",
  })
  botId: string;
}
