import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { SeasonDto } from "../models/season.dto";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class SlackService {
  constructor(private seasonsService: SeasonsService) {}

  public async getAllSeasons() {
    const seasons = await this.seasonsService.all();

    return this.formatSeasons(seasons);
  }

  private formatSeasonBlocks(seasons) {
    return seasons.flatMap(season => {
      console.log(season);
      return [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${season.name}*`,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `${new Date(season.startDate).toISOString()}`,
            },
            {
              type: "mrkdwn",
              text: "-",
            },
            {
              type: "mrkdwn",
              text: `${new Date(season.endDate).toISOString()}`,
            },
          ],
        },
        {
          type: "divider",
        },
      ];
    });
  }

  private formatSeasons(seasons) {
    return {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Diamonds",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "A list of all seasons!",
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        ...this.formatSeasonBlocks(seasons),
      ],
    };
  }
}
