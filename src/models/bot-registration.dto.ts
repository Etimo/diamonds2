import { ApiModelProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
export class BotRegistrationDto {
  @ApiModelProperty()
  readonly email: string;
  @ApiModelProperty()
  readonly name: string;
}
