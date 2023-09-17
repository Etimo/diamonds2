import { ApiProperty } from "@nestjs/swagger";

export class DiamondDto {
  @ApiProperty({
    description:
      "The value this diamond is worth. Also the number of spaces it takes in an inventory.",
  })
  points!: number;
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}
