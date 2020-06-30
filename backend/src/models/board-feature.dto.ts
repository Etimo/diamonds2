import { ApiModelProperty } from "@nestjs/swagger";
import { DiamondProviderConfig } from "src/gameengine/gameobjects/diamond/diamond-provider";
import { BotProviderConfig } from "src/gameengine/gameobjects/bot/bot-provider";
import { TeleportProviderConfig } from "src/gameengine/gameobjects/teleport/teleport-provider";

export default class BoardFeatureDto {
  @ApiModelProperty()
  name: string;
  @ApiModelProperty({
    description: "The configuration for this feature.",
  })
  config:
    | DiamondProviderConfig
    | BotProviderConfig
    | TeleportProviderConfig
    | {};
}
