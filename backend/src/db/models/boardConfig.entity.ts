import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "board_config" })
export class BoardConfigEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  seasonId: string;

  @Column({ type: "int", default: 5 })
  inventorySize: number;

  @Column({ type: "boolean", default: false })
  canTackle: boolean;

  @Column({ type: "int", default: 1 })
  teleporters: number;

  @Column({ type: "int", default: 10 })
  teleportRelocation: number;

  @Column({ type: "int", default: 15 })
  height: number;

  @Column({ type: "int", default: 15 })
  width: number;

  @Column({ type: "int", default: 100 })
  minimumDelayBetweenMoves: number;

  @Column({ type: "int", default: 60 })
  sessionLength: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createTimeStamp: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updateTimeStamp: Date;
}
