import { ApiProperty } from "@nestjs/swagger";
import {
  BotProviderConfig,
  DiamondProviderConfig,
  TeleportProviderConfig,
} from "../gameengine";

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
    | {}
    | null;
}
