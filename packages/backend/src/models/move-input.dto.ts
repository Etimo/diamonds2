import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { MoveDirection } from "../enums";

export class MoveInputDto {
  @ApiProperty({
    description: "The direction you want to move your bot in.",
    enum: MoveDirection,
  })
  @IsEnum(MoveDirection)
  direction!: MoveDirection;
}
