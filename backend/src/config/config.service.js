"use strict";
exports.__esModule = true;
require("dotenv").config();
var ConfigService = /** @class */ (function() {
  function ConfigService(env) {
    this.env = env;
  }
  ConfigService.prototype.getValue = function(key, throwOnMissing) {
    if (throwOnMissing === void 0) {
      throwOnMissing = true;
    }
    var value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error("config error - missing env." + key);
    }
    return value;
  };
  ConfigService.prototype.ensureValues = function(keys) {
    var _this = this;
    keys.forEach(function(k) {
      return _this.getValue(k, true);
    });
    return this;
  };
  ConfigService.prototype.getPort = function() {
    return this.getValue("PORT", true);
  };
  ConfigService.prototype.isProduction = function() {
    var mode = this.getValue("MODE", false);
    return mode != "DEV";
  };
  ConfigService.prototype.getTypeOrmConfig = function() {
    return {
      type: "postgres",
      host: this.getValue("DIAMONDS_ORM_HOST"),
      port: parseInt(this.getValue("DIAMONDS_ORM_PORT")),
      username: this.getValue("DIAMONDS_ORM_USERNAME"),
      password: this.getValue("DIAMONDS_ORM_PASSWORD"),
      database: this.getValue("DIAMONDS_ORM_DATABASE"),
      entities: ["**/*.entity{.ts,.js}"],
      migrationsTableName: "migration",
      migrations: ["src/migration/*.ts"],
      cli: {
        migrationsDir: "src/migration",
      },
      ssl: false,
    };
  };
  return ConfigService;
})();

var configService = new ConfigService(process.env).ensureValues([
  "DIAMONDS_ORM_HOST",
  "DIAMONDS_ORM_PORT",
  "DIAMONDS_ORM_USERNAME",
  "DIAMONDS_ORM_PASSWORD",
  "DIAMONDS_ORM_DATABASE",
]);
exports.configService = configService;
