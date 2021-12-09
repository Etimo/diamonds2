import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "recordings" })
export class RecordingsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 300 })
  botName: string;

  @Column({ type: "int" })
  score: number;

  @Column({ type: "int" })
  board: number;

  @Column({ type: "uuid", nullable: true })
  seasonId: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createTimeStamp: Date;

  @Column({ type: "text" })
  recording: string;
}
