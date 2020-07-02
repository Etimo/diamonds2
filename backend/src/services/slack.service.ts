import { Injectable } from "@nestjs/common";
import { SeasonsService } from "./seasons.service";
import {
  createSeasonsBody,
  createAddSeasonBody,
  showModal,
} from "../utils/slack.utils";

@Injectable()
export class SlackService {
  constructor(private seasonsService: SeasonsService) {}

  public async getAllSeasons(input) {
    const seasons = await this.seasonsService.all();
    const view = createSeasonsBody(input.trigger_id, seasons);
    return await showModal(view);
  }

  public async getSeasonModal(input) {
    const view = createAddSeasonBody(input.trigger_id);
    return await showModal(view);
  }

  public async addSeason(input) {}
}
