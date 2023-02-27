import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { MoveDirection } from "src/enums/move-direction.enum";

export class MoveInputDto {
  @ApiProperty({
    description: "The id of the bot that you want to move.",
  })
  botId: string;

  @ApiProperty({
    description: "The direction you want to move your bot in.",
    enum: MoveDirection,
  })
  @IsEnum(MoveDirection)
  direction: MoveDirection;
}
