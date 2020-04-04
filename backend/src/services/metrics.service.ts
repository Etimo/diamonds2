import { Injectable } from "@nestjs/common";
import * as Prometheus from "prom-client";

@Injectable()
export class MetricsService {
  playersTotal = new Prometheus.Gauge({
    name: "players_total",
    help: "Number of players on all boards",
    labelNames: ["board"],
  });
  incPlayersTotal(boardId: number) {
    this.playersTotal.inc({
      board: boardId,
    });
    this.playersTotal.inc();
  }
  decPlayersTotal(boardId: number) {
    this.playersTotal.dec({
      board: boardId,
    });
    this.playersTotal.dec();
  }
}
