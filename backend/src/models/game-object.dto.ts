import { ApiModelProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
import { TeleportGameObjectProperties } from "src/gameengine/gameobjects/teleport/teleport";
import { DiamondGameObjectProperties } from "src/gameengine/gameobjects/diamond/diamond";
import { BotGameObjectProperties } from "src/gameengine/gameobjects/bot/bot";

export class GameObjectDto {
  @ApiModelProperty({
    description: "The type of game object.",
  })
  type: string;
  @ApiModelProperty({
    description: "The position of the game object.",
  })
  position: PositionDto;
  @ApiModelProperty({
    description: "The properties, if any, of the game object.",
  })
  properties:
    | BotGameObjectProperties
    | TeleportGameObjectProperties
    | DiamondGameObjectProperties
    | {};
}
