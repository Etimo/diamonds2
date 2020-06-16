const dbConfig = {
  type: "postgres",
  port: 5432,
  host: process.env["TYPEORM_HOST"] || "localhost",
  username: process.env["TYPEORM_USERNAME"] || "postgres",
  password: process.env["TYPEORM_PASSWORD"] || "postgres",
  database: process.env["TYPEORM_DATABASE"] || "postgres",
  entities: ["**/*.entity{.ts,.js}"],
  migrationsTableName: "migration",
  migrations: ["./dist/migration/*{.ts,.js}"],
  cli: {
    entitiesDir: "./dist/db",
    migrationsDir: "./dist/migration",
  },
};
console.log("ormconfig.js db config", dbConfig.host);
console.log("MIGRATIONS:", dbConfig.migrations);
console.log("MIGRATIONS_DIR:", dbConfig.cli.migrationsDir);
module.exports = dbConfig;
