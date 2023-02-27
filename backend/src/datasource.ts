import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env["TYPEORM_HOST"] || "localhost",
  username: process.env["TYPEORM_USERNAME"] || "postgres",
  password: process.env["TYPEORM_PASSWORD"] || "postgres",
  database: process.env["TYPEORM_DATABASE"] || "postgres",
  entities: ["dist/**/*.entity.js"],
  migrationsTableName: "migration",
  migrations: ["dist/**/migration/*.js"],
  synchronize: false,
});
