import { ApiModelProperty } from "@nestjs/swagger";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";

export class BotRegistrationPublicDto {
  @ApiModelProperty()
  botName: string;
  @ApiModelProperty()
  email: string;
  @ApiModelProperty()
  token: string;

  public static from(dto: Partial<BotRegistrationPublicDto>) {
    const botRegistrationPublicObj = new BotRegistrationPublicDto();
    botRegistrationPublicObj.botName = dto.botName;
    botRegistrationPublicObj.email = dto.email;
    botRegistrationPublicObj.token = dto.token;
    return botRegistrationPublicObj;
  }

  public static fromEntity(entity: BotRegistrationsEntity) {
    return this.from({
      botName: entity.botName,
      email: entity.email,
      token: entity.token,
    });
  }
}
