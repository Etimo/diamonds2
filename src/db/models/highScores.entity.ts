import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "high_scores" })
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 300 })
  botName: string;

  @Column({ type: "int" })
  score: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createDateTime: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  lastChangedDateTime: Date;
}
