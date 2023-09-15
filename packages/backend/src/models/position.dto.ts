import { ApiProperty } from "@nestjs/swagger";

export class PositionDto {
  @ApiProperty({
    description: "The x position on the board.",
  })
  x!: number;

  @ApiProperty({
    description: "The y position on the board.",
  })
  y!: number;
}
