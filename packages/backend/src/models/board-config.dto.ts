import { ApiProperty } from "@nestjs/swagger";
import { ISeason } from "../types";

export class BoardConfigDto {
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

  // public static from(dto: Partial<BoardConfigDto>): BoardConfigDto {
  //   const boardConfigDto = new BoardConfigDto();
  //   boardConfigDto.id = dto.id;
  //   boardConfigDto.seasonId = dto.seasonId;
  //   boardConfigDto.inventorySize = dto.inventorySize;
  //   boardConfigDto.canTackle = dto.canTackle;
  //   boardConfigDto.teleporters = dto.teleporters;
  //   boardConfigDto.teleportRelocation = dto.teleportRelocation;
  //   boardConfigDto.height = dto.height;
  //   boardConfigDto.width = dto.width;
  //   boardConfigDto.minimumDelayBetweenMoves = dto.minimumDelayBetweenMoves;
  //   boardConfigDto.sessionLength = dto.sessionLength;
  //   return boardConfigDto;
  // }

  // public static create(dto: Partial<BoardConfigDto>): BoardConfigDto {
  //   // Create BoardConfigDto with no id!
  //   const boardConfigObj = new BoardConfigDto();
  //   boardConfigObj.seasonId = dto.seasonId;
  //   boardConfigObj.inventorySize = dto.inventorySize;
  //   boardConfigObj.canTackle = dto.canTackle;
  //   boardConfigObj.teleporters = dto.teleporters;
  //   boardConfigObj.teleportRelocation = dto.teleportRelocation;
  //   boardConfigObj.height = dto.height;
  //   boardConfigObj.width = dto.width;
  //   boardConfigObj.minimumDelayBetweenMoves = dto.minimumDelayBetweenMoves;
  //   boardConfigObj.sessionLength = dto.sessionLength;
  //   return boardConfigObj;
  // }

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
