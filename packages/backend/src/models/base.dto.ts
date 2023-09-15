import { ApiProperty } from "@nestjs/swagger";

export class BaseDto {
  @ApiProperty()
  x!: number;
  @ApiProperty()
  y!: number;
}
