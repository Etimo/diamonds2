export interface IBoardConfigDto {
  id: string;
  seasonId: string;
  inventorySize: number;
  canTackle: boolean;
  teleporters: number;
  teleportRelocation: number;
  height: number;
  width: number;
  minimumDelayBetweenMoves: number;
  sessionLength: number;
}
