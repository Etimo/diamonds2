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
    return seasons.map(season => {
      console.log(season);
      return {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${season.name}*\n${season.startDate} - ${season.endDate}\n Hello season ${season.name}`,
        },
        accessory: {
          type: "image",
          image_url:
            "https://s3-media3.fl.yelpcdn.com/bphoto/c7ed05m9lC2EmA3Aruue7A/o.jpg",
          alt_text: "alt text for image",
        },
      };
    });
  }

  private formatSeasons(seasons) {
    const seasonBlocks = this.formatSeasonBlocks(seasons);
    console.log(seasonBlocks);
    return {
      title: {
        type: "plain_text",
        text: "Diamonds",
        emoji: true,
      },
      type: "modal",
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Hello, you can find all seasons below!",
          },
        },
        {
          type: "divider",
        },
        seasonBlocks,
      ],
    };
  }
}
