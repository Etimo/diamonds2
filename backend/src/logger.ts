import { LoggerService } from "@nestjs/common";

import * as chalk from "chalk";
import * as log from "loglevel";
import * as prefix from "loglevel-plugin-prefix";

const colors = {
  TRACE: chalk["magenta"],
  DEBUG: chalk["cyan"],
  INFO: chalk["blue"],
  WARN: chalk["yellow"],
  ERROR: chalk["red"],
};

prefix.reg(log);
log.enableAll();

// prefix.apply(log, {
//     template: '[%t] %l (%n) static text:',
//     levelFormatter(level) {
//       return level.toUpperCase();
//     },
//     nameFormatter(name) {
//       return name || 'global';
//     },
//     timestampFormatter(date) {
//       return date.toISOString();
//     },
//   });
prefix.apply(log, {
  format(level, name, timestamp) {
    return `${chalk["gray"](`[${timestamp}]`)} ${colors[level](
      level.toUpperCase().padEnd(8, " "),
    )} `;
  },
  timestampFormatter(date) {
    return date.toISOString();
  },
});

prefix.apply(log.getLogger("critical"), {
  format(level, name, timestamp) {
    return chalk["red"]["bold"](`[${timestamp}] ${level} ${name}:`);
  },
});

export default log;

export class CustomLogger implements LoggerService {
  log(message: string) {
    log.debug(message);
  }
  error(message: string, trace: string) {
    log.error(message);
  }
  trace(message: string) {
    log.debug(message);
  }
  warn(message: string) {
    log.warn(message);
  }
  debug(message: string) {
    log.debug(message);
  }
  info(message: string) {
    log.info(message);
  }
  verbose(message: string) {
    log.debug(message);
  }
}
