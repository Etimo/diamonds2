import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { RecordingListDto, RecordingPublicDto } from "../models";
import { RecordingsService } from "../services";

@ApiTags("Recordings")
@Controller("api/recordings")
export class RecordingsController {
  constructor(private recordingsService: RecordingsService) {}

  /**
   * Returns all highscores on a specific season.
   *
   * @param season The name of the season.
   */
  @ApiResponse({
    status: 200,
    description: "Returns recordings by season",
    isArray: true,
    type: RecordingListDto,
  })
  @ApiResponse({
    status: 404,
    description: "Season not found",
  })
  @Get("seasons/:seasonId")
  async list(@Param("seasonId") seasonId: string): Promise<RecordingListDto[]> {
    return await this.recordingsService.allBySeasonIdList(seasonId);
  }

  /**
   * Return a specific recording.
   *
   * @param id The id of the recording.
   */
  @ApiResponse({
    status: 200,
    description: "Returns specific recording",
    type: RecordingPublicDto,
  })
  @ApiResponse({
    status: 404,
    description: "Recording or season not found",
  })
  @Get(":id")
  public find(@Param("id") id: string): Promise<RecordingPublicDto> {
    return this.recordingsService.getById(id);
  }
}
