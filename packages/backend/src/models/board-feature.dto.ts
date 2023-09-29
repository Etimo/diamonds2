import {
  BotProviderConfig,
  DiamondProviderConfig,
  TeleportProviderConfig,
  TeleportRelocationProviderConfig,
} from "@etimo/diamonds2-types";
import { ApiProperty } from "@nestjs/swagger";

export default class BoardFeatureDto {
  @ApiProperty()
  name!: string;
  @ApiProperty({
    description: "The configuration for this feature.",
  })
  config!:
    | DiamondProviderConfig
    | BotProviderConfig
    | TeleportProviderConfig
    | TeleportRelocationProviderConfig
    | {}
    | null;
}
