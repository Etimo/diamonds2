import { ApiModelProperty } from "@nestjs/swagger";
import { MoveDirection } from "src/enums/move-direction.enum";
import { IsEnum } from "class-validator";

export class MoveInputDto {
  @ApiModelProperty({
    description: "The secret token of the bot that you want to move.",
  })
  botToken: string;
  @ApiModelProperty({
    description: "The direction you want to move your bot in.",
    enum: MoveDirection,
  })
  @IsEnum(MoveDirection)
  direction: MoveDirection;
}
