import { ApiModelProperty } from "@nestjs/swagger";
import { Bot } from "@prisma/client";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";

export class BotRegistrationPublicDto {
  @ApiModelProperty({
    description: "The name you registered with.",
  })
  botName: string;
  @ApiModelProperty({
    description: "The email you registered with.",
  })
  email: string;
  @ApiModelProperty({
    description:
      "Your unique, and secret, token. Use this for all your requests.",
  })
  token: string;

  public static from(dto: Partial<BotRegistrationPublicDto>) {
    const botRegistrationPublicObj = new BotRegistrationPublicDto();
    botRegistrationPublicObj.botName = dto.botName;
    botRegistrationPublicObj.email = dto.email;
    botRegistrationPublicObj.token = dto.token;
    return botRegistrationPublicObj;
  }

  public static fromEntity(entity: Bot) {
    return this.from({
      botName: entity.name,
      email: entity.email,
      token: entity.token,
    });
  }
}
