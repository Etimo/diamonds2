import { SlackService } from "./slack.service";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SeasonDto } from "../models/season.dto";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import { SeasonsService } from "./seasons.service";
import { repositoryMockFactory } from "./board.service.spec";

describe("SeasonsService", () => {
  let slackService: SlackService;
  let seasonsService: SeasonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlackService,
        SeasonsService,
        {
          provide: getRepositoryToken(SeasonsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    slackService = module.get<SlackService>(SlackService);
    seasonsService = module.get<SeasonsService>(SeasonsService);
    jest.clearAllMocks();
  });
  it("should be defined", () => {
    expect(SlackService).toBeDefined();
    expect(SeasonsService).toBeDefined();
  });

  it("handleInteract, Should return error in slack format", async () => {
    const payload = {
      payload:
        '{"type":"view_submission","team":{"id":"T044B4VDU","domain":"etimo"},"user":{"id":"UNQMJCUBU","username":"philip.forsberg","name":"philip.forsberg","team_id":"T044B4VDU"},"api_app_id":"A016CKNFP6F","token":"9EiOLDyhuUi3LlXQOZbPfVks","trigger_id":"1247562526480.4147165470.3284751d2143c0a6d8489027ee64dd4f","view":{"id":"V0179GJD2TA","team_id":"T044B4VDU","type":"modal","blocks":[{"type":"input","block_id":"season_name","label":{"type":"plain_text","text":"Season name","emoji":true},"optional":false,"element":{"type":"plain_text_input","action_id":"Hx6W"}},{"type":"input","block_id":"start_date","label":{"type":"plain_text","text":"Start date","emoji":true},"optional":false,"element":{"type":"datepicker","initial_date":"2020-07-06","placeholder":{"type":"plain_text","text":"Select a date","emoji":true},"action_id":"7Lg5"}},{"type":"input","block_id":"end_date","label":{"type":"plain_text","text":"End date","emoji":true},"optional":false,"element":{"type":"datepicker","initial_date":"2020-08-05","placeholder":{"type":"plain_text","text":"Select a date","emoji":true},"action_id":"OVme"}}],"private_metadata":"","callback_id":"add-season","state":{"values":{"start_date":{"7Lg5":{"type":"datepicker","selected_date":"2020-07-06"}},"end_date":{"OVme":{"type":"datepicker","selected_date":"2020-08-05"}},"season_name":{"Hx6W":{"type":"plain_text_input","value":"asd"}}}},"hash":"1594018450.CovdWvl7","title":{"type":"plain_text","text":"Add season","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0179GJD2TA","app_id":"A016CKNFP6F","external_id":"","app_installed_team_id":"T044B4VDU","bot_id":"B0172AHQ8QG"},"response_urls":[]}',
    };

    // Mocking addSeason to throw error
    spyOn<any>(seasonsService, "add").and.callFake(() => throwException());

    await expect(slackService.handleInteract(payload)).resolves.toHaveProperty(
      "errors.start_date",
    );
  });

  const throwException = () => {
    throw new ConflictError("test", "start_date");
  };

  it("handleInteract, Season is added, return undefined", async () => {
    const payload = {
      payload:
        '{"type":"view_submission","team":{"id":"T044B4VDU","domain":"etimo"},"user":{"id":"UNQMJCUBU","username":"philip.forsberg","name":"philip.forsberg","team_id":"T044B4VDU"},"api_app_id":"A016CKNFP6F","token":"9EiOLDyhuUi3LlXQOZbPfVks","trigger_id":"1247562526480.4147165470.3284751d2143c0a6d8489027ee64dd4f","view":{"id":"V0179GJD2TA","team_id":"T044B4VDU","type":"modal","blocks":[{"type":"input","block_id":"season_name","label":{"type":"plain_text","text":"Season name","emoji":true},"optional":false,"element":{"type":"plain_text_input","action_id":"Hx6W"}},{"type":"input","block_id":"start_date","label":{"type":"plain_text","text":"Start date","emoji":true},"optional":false,"element":{"type":"datepicker","initial_date":"2020-07-06","placeholder":{"type":"plain_text","text":"Select a date","emoji":true},"action_id":"7Lg5"}},{"type":"input","block_id":"end_date","label":{"type":"plain_text","text":"End date","emoji":true},"optional":false,"element":{"type":"datepicker","initial_date":"2020-08-05","placeholder":{"type":"plain_text","text":"Select a date","emoji":true},"action_id":"OVme"}}],"private_metadata":"","callback_id":"add-season","state":{"values":{"start_date":{"7Lg5":{"type":"datepicker","selected_date":"2020-07-06"}},"end_date":{"OVme":{"type":"datepicker","selected_date":"2020-08-05"}},"season_name":{"Hx6W":{"type":"plain_text_input","value":"asd"}}}},"hash":"1594018450.CovdWvl7","title":{"type":"plain_text","text":"Add season","emoji":true},"clear_on_close":false,"notify_on_close":false,"close":{"type":"plain_text","text":"Cancel","emoji":true},"submit":{"type":"plain_text","text":"Submit","emoji":true},"previous_view_id":null,"root_view_id":"V0179GJD2TA","app_id":"A016CKNFP6F","external_id":"","app_installed_team_id":"T044B4VDU","bot_id":"B0172AHQ8QG"},"response_urls":[]}',
    };

    // Mocking addSeason to return a season
    spyOn<any>(seasonsService, "add").and.returnValue(
      SeasonDto.from({
        id: "123",
        name: "test",
        startDate: new Date(),
        endDate: new Date(),
      }),
    );

    await expect(slackService.handleInteract(payload)).resolves.toEqual(
      undefined,
    );
  });
});
