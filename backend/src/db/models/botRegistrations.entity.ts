import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";

@Entity({ name: "bot_registrations" })
export class BotRegistrationsEntity {
  @PrimaryGeneratedColumn("uuid")
  token: string;

  @Column({ type: "varchar", length: 300 })
  botName: string;

  @Column({ type: "varchar", length: 300 })
  email: string;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createTimeStamp: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updateTimeStamp: Date;

  @Column({ type: "varchar", length: 300, nullable: true })
  password: string;

  @Column({ type: "uuid", nullable: true })
  team: string;
}
