module.exports = {
  type: "postgres",
  port: 5432,
  host: "localhost",
  username: "postgres",
  password: "postgres",
  database: "postgres",
  entities: ["**/*.entity{.ts,.js}"],
  migrationsTableName: "migration",
  migrations: ["src/migration/*.ts"],
  cli: {
    entitiesDir: "src/db",
    migrationsDir: "src/migration",
  },
};
