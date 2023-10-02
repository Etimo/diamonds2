import {
  BaseGameObjectProperties,
  BotGameObjectProperties,
  DiamondGameObjectProperties,
  TeleportProperties,
} from "@etimo/diamonds2-types";
import { ApiProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";

export class GameObjectDto {
  @ApiProperty({
    description: "The type of game object.",
  })
  type!: string;
  @ApiProperty({
    description: "The position of the game object.",
  })
  position!: PositionDto;
  @ApiProperty({
    description: "The properties, if any, of the game object.",
  })
  properties!:
    | BotGameObjectProperties
    | DiamondGameObjectProperties
    | BaseGameObjectProperties
    | TeleportProperties;
}
