import { ApiModelProperty } from "@nestjs/swagger";
import { BoardConfigEntity } from "../db/models/boardConfig.entity";

export class BoardConfigDto {
  @ApiModelProperty()
  id: string;
  @ApiModelProperty()
  seasonId: string;
  @ApiModelProperty()
  inventorySize: number;
  @ApiModelProperty()
  canTackle: boolean;
  @ApiModelProperty()
  teleporters: number;
  @ApiModelProperty()
  teleportRelocation: number;
  @ApiModelProperty()
  height: number;
  @ApiModelProperty()
  width: number;
  @ApiModelProperty()
  minimumDelayBetweenMoves: number;
  @ApiModelProperty()
  sessionLength: number;

  public static from(dto: Partial<BoardConfigDto>): BoardConfigDto {
    const boardConfigDto = new BoardConfigDto();
    boardConfigDto.id = dto.id;
    boardConfigDto.seasonId = dto.seasonId;
    boardConfigDto.inventorySize = dto.inventorySize;
    boardConfigDto.canTackle = dto.canTackle;
    boardConfigDto.teleporters = dto.teleporters;
    boardConfigDto.teleportRelocation = dto.teleportRelocation;
    boardConfigDto.height = dto.height;
    boardConfigDto.width = dto.width;
    boardConfigDto.minimumDelayBetweenMoves = dto.minimumDelayBetweenMoves;
    boardConfigDto.sessionLength = dto.sessionLength;
    return boardConfigDto;
  }

  public static create(dto: Partial<BoardConfigDto>): BoardConfigDto {
    // Create BoardConfigDto with no id!
    const boardConfigObj = new BoardConfigDto();
    boardConfigObj.seasonId = dto.seasonId;
    boardConfigObj.inventorySize = dto.inventorySize;
    boardConfigObj.canTackle = dto.canTackle;
    boardConfigObj.teleporters = dto.teleporters;
    boardConfigObj.teleportRelocation = dto.teleportRelocation;
    boardConfigObj.height = dto.height;
    boardConfigObj.width = dto.width;
    boardConfigObj.minimumDelayBetweenMoves = dto.minimumDelayBetweenMoves;
    boardConfigObj.sessionLength = dto.sessionLength;
    return boardConfigObj;
  }

  public static fromEntity(entity: BoardConfigEntity): BoardConfigDto {
    return this.from({
      id: entity.id,
      seasonId: entity.seasonId,
      inventorySize: entity.inventorySize,
      canTackle: entity.canTackle,
      teleporters: entity.teleporters,
      teleportRelocation: entity.teleportRelocation,
      height: entity.height,
      width: entity.width,
      minimumDelayBetweenMoves: entity.minimumDelayBetweenMoves,
      sessionLength: entity.sessionLength,
    });
  }
}
