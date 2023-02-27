import { ApiProperty } from "@nestjs/swagger";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";

export class BotRegistrationPublicDto {
  @ApiProperty({
    description: "The name you registered with.",
  })
  botName: string;
  @ApiProperty({
    description: "The email you registered with.",
  })
  email: string;
  @ApiProperty({
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

  public static fromEntity(entity: BotRegistrationsEntity) {
    return this.from({
      botName: entity.botName,
      email: entity.email,
      token: entity.token,
    });
  }
}
