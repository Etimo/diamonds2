import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "seasons" })
export class SeasonsEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 300 })
  name: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  startDate: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  endDate: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createTimeStamp: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updateTimeStamp: Date;
}
