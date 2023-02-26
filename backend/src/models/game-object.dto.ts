import { ApiProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";
import { TeleportGameObjectProperties } from "src/gameengine/gameobjects/teleport/teleport";
import { DiamondGameObjectProperties } from "src/gameengine/gameobjects/diamond/diamond";
import { BotGameObjectProperties } from "src/gameengine/gameobjects/bot/bot";

export class GameObjectDto {
  @ApiProperty({
    description: "The type of game object.",
  })
  type: string;
  @ApiProperty({
    description: "The position of the game object.",
  })
  position: PositionDto;
  @ApiProperty({
    description: "The properties, if any, of the game object.",
  })
  properties:
    | BotGameObjectProperties
    | TeleportGameObjectProperties
    | DiamondGameObjectProperties
    | {};
}
