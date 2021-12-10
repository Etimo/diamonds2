const dbConfig = {
  type: "postgres",
  port: 5432,
  host: process.env["TYPEORM_HOST"] || "localhost",
  username: process.env["TYPEORM_USERNAME"] || "postgres",
  password: process.env["TYPEORM_PASSWORD"] || "postgres",
  database: process.env["TYPEORM_DATABASE"] || "postgres",
  entities: ["**/*.entity{.ts,.js}"],
  migrationsTableName: "migration",
  migrations: ["src/migration/*.ts"],
  synchronize: false,
  cli: {
    entitiesDir: "src/db",
    migrationsDir: "src/migration",
  },
};
console.log("ormconfig.js db config", dbConfig.host);
module.exports = dbConfig;
