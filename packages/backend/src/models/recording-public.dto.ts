import { ApiProperty } from "@nestjs/swagger";

export class RecordingPublicDto {
  @ApiProperty()
  botName!: string;

  @ApiProperty()
  score!: number;

  @ApiProperty()
  board!: number;

  @ApiProperty()
  seasonId!: string;

  @ApiProperty()
  recording!: string;

  @ApiProperty()
  created!: Date;

  // public static from(dto: Partial<RecordingPublicDto>) {
  //   const recordingObj = new RecordingPublicDto();
  //   recordingObj.botName = dto.botName;
  //   recordingObj.score = dto.score;
  //   recordingObj.seasonId = dto.seasonId;
  //   recordingObj.board = dto.board;
  //   recordingObj.created = dto.created;
  //   recordingObj.recording = dto.recording;
  //   return recordingObj;
  // }

  // public static fromRawDataObject(data: {}) {
  //   return this.from({
  //     botName: data["recordings_botName"],
  //     score: data["recordings_score"],
  //     board: data["recordings_board"],
  //     created: data["recordings_createTimeStamp"],
  //     seasonId: data["recordings_seasonId"],
  //     recording: JSON.parse(data["recordings_recording"]),
  //   });
  // }
}
