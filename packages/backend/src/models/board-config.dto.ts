import { IBoardConfigDto } from "@etimo/diamonds2-types";
import { ApiProperty } from "@nestjs/swagger";
import { ISeason } from "../types";

export class BoardConfigDto implements IBoardConfigDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  seasonId!: string;

  @ApiProperty()
  inventorySize!: number;

  @ApiProperty()
  canTackle!: boolean;

  @ApiProperty()
  teleporters!: number;

  @ApiProperty()
  teleportRelocation!: number;

  @ApiProperty()
  height!: number;

  @ApiProperty()
  width!: number;

  @ApiProperty()
  minimumDelayBetweenMoves!: number;

  @ApiProperty()
  sessionLength!: number;

  public static fromSeasonWithBoardConfig(entity: ISeason): BoardConfigDto {
    return {
      id: entity.boardConfig!.id,
      seasonId: entity.id,
      inventorySize: entity.boardConfig!.inventorySize,
      canTackle: entity.boardConfig!.canTackle,
      teleporters: entity.boardConfig!.teleporters,
      teleportRelocation: entity.boardConfig!.teleportRelocation,
      height: entity.boardConfig!.height,
      width: entity.boardConfig!.width,
      minimumDelayBetweenMoves: entity.boardConfig!.minimumDelayBetweenMoves,
      sessionLength: entity.boardConfig!.sessionLength,
    };
  }
}
