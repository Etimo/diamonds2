import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "teams" })
export class TeamsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 300 })
  name: string;

  @Column({ type: "varchar", length: 20 })
  abbreviation: string;

  @Column({ type: "varchar", length: 1000 })
  logotypeUrl: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createTimeStamp: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updateTimeStamp: Date;
}
