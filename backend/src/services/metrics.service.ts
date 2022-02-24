import { Injectable } from "@nestjs/common";
import * as Prometheus from "prom-client";

@Injectable()
export class MetricsService {
  private playersTotal = new Prometheus.Gauge({
    name: "players_total",
    help: "Number of players on all boards",
    labelNames: ["board"],
  });
  private sessionsStarted = new Prometheus.Counter({
    name: "sessions_started",
    help: "Number of play sessions started",
    labelNames: ["board"],
  });
  private movesPerformed = new Prometheus.Counter({
    name: "moves_performed",
    help: "Number of moves performed",
    labelNames: ["board"],
  });
  private botsRegistered = new Prometheus.Counter({
    name: "bots_registered",
    help: "Number of bots registered",
  });
  private highscoresImproved = new Prometheus.Counter({
    name: "highscores_improved",
    help: "Number of times a highscore improved",
  });

  private boardsTotal = new Prometheus.Gauge({
    name: "boards_total",
    help: "Number of boards",
    labelNames: ["board"],
  });

  incBotsRegistered() {
    this.botsRegistered.inc();
  }

  incSessionsStarted(boardId: number) {
    this.sessionsStarted.inc({
      board: boardId,
    });
    this.sessionsStarted.inc();
  }

  incHighscoresImproved() {
    this.highscoresImproved.inc();
  }

  incMovesPerformed(boardId: number) {
    this.movesPerformed.inc({
      board: boardId,
    });
    this.movesPerformed.inc();
  }

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
  incBoardsTotal() {
    this.boardsTotal.inc();
  }
  decBoardsTotal() {
    this.boardsTotal.dec();
  }
}
