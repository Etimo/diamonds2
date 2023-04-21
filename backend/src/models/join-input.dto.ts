import { ApiProperty } from "@nestjs/swagger";

export class JoinInputDto {
  @ApiProperty({
    description: "The id of the board that you prefer to join.",
  })
  preferredBoardId?: number;
}
