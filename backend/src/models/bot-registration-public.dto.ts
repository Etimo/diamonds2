import { ApiProperty } from "@nestjs/swagger";

export class BotRegistrationPublicDto {
  @ApiProperty({
    description:
      "Your unique, and secret, token. Use this for all your requests.",
  })
  id: string;

  @ApiProperty({
    description: "The name you registered with.",
  })
  name: string;

  @ApiProperty({
    description: "The email you registered with.",
  })
  email: string;

  // public static from(dto: Partial<BotRegistrationPublicDto>) {
  //   const botRegistrationPublicObj = new BotRegistrationPublicDto();
  //   botRegistrationPublicObj.botName = dto.botName;
  //   botRegistrationPublicObj.email = dto.email;
  //   botRegistrationPublicObj.id = dto.id;
  //   return botRegistrationPublicObj;
  // }

  // public static fromEntity(entity: Bot) {
  //   return this.from({
  //     botName: entity.name,
  //     email: entity.email,
  //     id: entity.id,
  //   });
  // }
}
