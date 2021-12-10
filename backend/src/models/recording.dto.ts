import { RecordingsEntity } from "src/db/models/recordings.entity";

export class RecordingDto {
  botName: string;
  score: number;
  board: number;
  seasonId: string;
  recording: string;

  public static from(dto: Partial<RecordingDto>) {
    const recordingObj = new RecordingDto();
    recordingObj.botName = dto.botName;
    recordingObj.score = dto.score;
    recordingObj.seasonId = dto.seasonId;
    return recordingObj;
  }

  public static fromEntity(entity: RecordingsEntity) {
    return this.from({
      botName: entity.botName,
      score: entity.score,
      seasonId: entity.seasonId,
      recording: entity.recording,
    });
  }
}
