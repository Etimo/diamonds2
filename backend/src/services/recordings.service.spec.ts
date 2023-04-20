import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { RecordingsRepository } from "../db";
import { NotFoundError } from "../errors";
import { SilentLogger } from "../gameengine";
import { CustomLogger } from "../logger";
import { RecordingListDto, RecordingPublicDto } from "../models";
import { INewRecording, IRecording, ISaveRecording } from "../types";
import { RecordingsService } from "./recordings.service";
import { recordingsRepositoryMock } from "./test-helper.spec";

describe("RecordingsService", () => {
  let recordingsService: RecordingsService;
  const maxStates = 3;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordingsService,
        {
          provide: RecordingsRepository,
          useValue: recordingsRepositoryMock,
        },
        {
          provide: CustomLogger,
          useValue: new SilentLogger(),
        },
      ],
    }).compile();

    recordingsService = module.get<RecordingsService>(RecordingsService);
    recordingsService.setup(1, maxStates);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(recordingsService).toBeDefined();
  });

  it("should return empty recording", () => {
    const res = recordingsService.getRecording(0);
    expect(res).toEqual([]);
  });

  it("should record state", () => {
    recordingsService.record(0, "Hello");

    const res = recordingsService.getRecording(0);

    expect(res).toEqual(["Hello"]);
  });

  it("should record in rolling window", () => {
    for (let i = 0; i < maxStates + 1; i++) {
      recordingsService.record(0, i);
    }
    const res = recordingsService.getRecording(0);
    expect(res).toEqual([1, 2, 3]);
  });

  it("getById, should throw error get by id", async () => {
    recordingsRepositoryMock.getById.mockReturnValue(
      new Promise((resolve) => resolve([])),
    );

    const res = recordingsService.getById("123");

    return expect(res).rejects.toThrowError(NotFoundError);
  });

  it("getById, should return data when present", async () => {
    //Arrange
    const d = new Date(2021, 1, 1, 1, 1, 1, 1);
    const id = "123";

    const recordingFromRepo: IRecording = {
      id: id,
      score: 1,
      board: 0,
      seasonId: "",
      createTimeStamp: d,
      botId: "id",
      recording: "{}",
    };

    const expectedRecording: RecordingPublicDto = {
      score: 1,
      board: 0,
      seasonId: "",
      created: d,
      botName: "",
      recording: "{}",
    };

    recordingsRepositoryMock.getById.mockReturnValue(
      new Promise((resolve) => resolve([recordingFromRepo] as IRecording[])),
    );

    //Act
    const res = await recordingsService.getById(id);

    //Assert
    expect(res).toEqual(expectedRecording);
  });

  it("allBySeasonIdList, should throw error if invalid season", async () => {
    recordingsRepositoryMock.allBySeasonIdRaw.mockReturnValue(
      new Promise((resolve) => resolve([])),
    );

    const res = recordingsService.allBySeasonIdList("");

    return expect(res).rejects.toThrowError(NotFoundError);
  });

  it("allBySeasonIdList, should return data when present", async () => {
    const d = new Date(2021, 1, 1, 1, 1, 1, 1);
    const dataFromRepo: IRecording = {
      id: "id",
      score: 1,
      board: 0,
      seasonId: "",
      createTimeStamp: d,
      botId: "Hello",
      recording: "{}",
    };

    const expectedResult: RecordingListDto = {
      recordingId: "id",
      score: 1,
      board: 0,
      created: d,
      botName: "",
    };

    recordingsRepositoryMock.allBySeasonIdRaw.mockReturnValue(
      new Promise((resolve) => resolve([dataFromRepo])),
    );

    const res = await recordingsService.allBySeasonIdList("");

    expect(res).toEqual([expectedResult]);
  });

  it("save, should save entry", async () => {
    //arrange
    const d = new Date(2021, 1, 1, 1, 1, 1, 1);
    const seasonId = "id";
    const newRecording: ISaveRecording = {
      score: 1,
      board: 0,
      seasonId: seasonId,
      botId: "Hello",
    };
    const dataFromRepo: IRecording = {
      id: "id",
      score: 1,
      board: 0,
      seasonId: seasonId,
      createTimeStamp: d,
      botId: "Hello",
      recording: "[4]",
    };

    const expectedRepoCreateParameter: INewRecording = {
      score: 1,
      board: 0,
      seasonId: seasonId,
      botId: "Hello",
      recording: "[4]",
    };
    recordingsService.record(0, 4);
    var mockCreate =
      recordingsRepositoryMock.create.mockReturnValue(dataFromRepo);
    recordingsRepositoryMock.getScores.mockReturnValue([
      11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
    ]);

    //act
    await recordingsService.save(newRecording);

    //assert
    expect(mockCreate).toHaveBeenCalledWith(expectedRepoCreateParameter);
  });

  it("save, should purge old", async () => {
    //arrange
    const d = new Date(2021, 1, 1, 1, 1, 1, 1);
    const seasonId = "id";
    const newRecording: INewRecording = {
      score: 1,
      board: 0,
      seasonId: seasonId,
      botId: "Hello",
      recording: "{}",
    };
    const dataFromRepo: IRecording = {
      id: "id",
      score: 1,
      board: 0,
      seasonId: seasonId,
      createTimeStamp: d,
      botId: "Hello",
      recording: "{}",
    };
    recordingsRepositoryMock.create.mockReturnValue(dataFromRepo);
    recordingsRepositoryMock.getScores.mockReturnValue([
      11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1,
    ]);

    //act
    await recordingsService.save(newRecording);

    //assert
    expect(
      recordingsRepositoryMock.deleteRecordingsWithLowScore,
    ).toHaveBeenCalledWith(seasonId, 2);
  });
});
