const prefix = "DIAMONDS_ORM_";

function getValue(key, defaultValue) {
  // Return value from env or default value
  return process.env[prefix + key] || defaultValue;
}

const config = {
  "type": "postgres",
  "host": getValue("HOST", "database"),
  "port": parseInt(getValue("PORT", 5432)),
  "username": getValue("USERNAME", "postgres"),
  "password": getValue("PASSWORD", "postgres"),
  "database": getValue("DATABASE", "postgres"),
  "entities": ["**/*.entity{.ts,.js}"],
  "migrationsTableName": "migration",
  "migrations": ["src/migration/*.ts"],
  "cli": {
    "migrationsDir": "src/migration"
  },
  "ssl": false
};

console.log(`Orm config: ${config["host"]}:${config["port"]}, username=${config["username"]}, database=${config["database"]}`);

module.exports = config;
