import { RecordingsService } from "./recordings.service";
import SilentLogger from "../gameengine/util/silent-logger";
import { RecordingsRepository } from "../db/repositories/recordings.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RecordingsEntity } from "../db/models/recordings.entity";
import { CustomLogger } from "../logger";
import NotFoundError from "../errors/not-found.error";
import { RecordingListDto } from "../models/recording-list.dto";

describe("RecordingsService", () => {
  let recordingsService: RecordingsService;
  let recordingsRepository: RecordingsRepository;
  const maxStates = 3;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordingsService,
        RecordingsRepository,
        {
          provide: getRepositoryToken(RecordingsEntity),
          useFactory: () => jest.fn(),
        },
        {
          provide: CustomLogger,
          useValue: new SilentLogger(),
        },
      ],
    }).compile();
    recordingsRepository = module.get(RecordingsRepository);
    recordingsService = new RecordingsService(
      recordingsRepository,
      new SilentLogger(),
    );
    recordingsService.setup(1, maxStates);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  describe("getById", () => {
    it("should throw error get by id", async () => {
      const mock = jest.spyOn(recordingsRepository, "getById");
      mock.mockReturnValue(new Promise(resolve => resolve([])));

      const res = recordingsService.getById("", "");

      return expect(res).rejects.toThrowError(NotFoundError);
    });

    it("should return data when present", async () => {
      const d = new Date(2021, 1, 1, 1, 1, 1, 1);
      jest.spyOn(recordingsRepository, "getById").mockReturnValue(
        new Promise(resolve =>
          resolve([
            {
              recordings_id: "",
              recordings_score: 1,
              recordings_board: 0,
              recordings_seasonId: "",
              recordings_createTimeStamp: d,
              recordings_botName: "Hello",
              recordings_recording: "{}",
            },
          ] as Object[]),
        ),
      );

      const res = await recordingsService.getById("", "");
      expect(res).toEqual({
        board: 0,
        botName: "Hello",
        created: d,
        recording: {},
        score: 1,
        seasonId: "",
      });
    });
  });

  describe("allBySeasonIdList", () => {
    it("should throw error if invalid season", async () => {
      jest
        .spyOn(recordingsRepository, "allBySeasonIdRaw")
        .mockReturnValue(new Promise(resolve => resolve([])));

      const res = recordingsService.allBySeasonIdList("");

      return expect(res).rejects.toThrowError(NotFoundError);
    });

    it("should return data when present", async () => {
      const d = new Date(2021, 1, 1, 1, 1, 1, 1);
      const data = {
        recordings_id: "id",
        recordings_score: 1,
        recordings_board: 0,
        recordings_seasonId: "",
        recordings_createTimeStamp: d,
        recordings_botName: "Hello",
        recordings_recording: "{}",
      };
      jest
        .spyOn(recordingsRepository, "allBySeasonIdRaw")
        .mockReturnValue(new Promise(resolve => resolve([data])));

      const res = await recordingsService.allBySeasonIdList("");

      expect(res).toEqual([RecordingListDto.fromRawDataObject(data)]);
    });
  });

  describe("save", () => {
    it("should create entry", async () => {
      const mock = jest
        .spyOn(recordingsRepository, "create")
        .mockReturnValue(new Promise(resolve => resolve(null)));
      jest
        .spyOn(recordingsRepository, "purgeOld")
        .mockReturnValue(new Promise(resolve => resolve(undefined)));

      await recordingsService.save({
        boardIndex: 0,
        botName: "name",
        score: 1,
        seasonId: "id",
      });

      expect(mock).toHaveBeenCalledWith({
        board: 0,
        botName: "name",
        score: 1,
        seasonId: "id",
        recording: "[]",
      });
    });

    it("should purge old", async () => {
      jest
        .spyOn(recordingsRepository, "create")
        .mockReturnValue(new Promise(resolve => resolve(null)));
      const mock = jest
        .spyOn(recordingsRepository, "purgeOld")
        .mockReturnValue(new Promise(resolve => resolve(undefined)));

      await recordingsService.save({
        boardIndex: 0,
        botName: "name",
        score: 1,
        seasonId: "id",
      });

      expect(mock).toHaveBeenCalledWith("id");
    });
  });
});
