import { IRecording } from "../types";

export class RecordingDto {
  botName!: string;
  score!: number;
  board!: number;
  seasonId!: string;
  recording!: string;

  public static from(dto: RecordingDto) {
    const recordingObj = new RecordingDto();
    recordingObj.botName = dto.botName;
    recordingObj.score = dto.score;
    recordingObj.seasonId = dto.seasonId;
    return recordingObj;
  }

  public static fromEntity(entity: IRecording) {
    return this.from({
      botName: entity.bot?.name ?? "",
      score: entity.score,
      seasonId: entity.seasonId,
      recording: entity.recording,
      board: entity.board,
    });
  }
}
