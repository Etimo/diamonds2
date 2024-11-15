import { LoggerService } from "@nestjs/common";

// const colors = {
//   // @ts-ignore
//   TRACE: chalk["magenta"],
//   // @ts-ignore
//   DEBUG: chalk["cyan"],
//   // @ts-ignore
//   INFO: chalk["blue"],
//   // @ts-ignore
//   WARN: chalk["yellow"],
//   // @ts-ignore
//   ERROR: chalk["red"],
// };

// prefix.reg(log);
// log.enableAll();

// // prefix.apply(log, {
// //     template: '[%t] %l (%n) static text:',
// //     levelFormatter(level) {
// //       return level.toUpperCase();
// //     },
// //     nameFormatter(name) {
// //       return name || 'global';
// //     },
// //     timestampFormatter(date) {
// //       return date.toISOString();
// //     },
// //   });
// prefix.apply(log, {
//   format(level, name, timestamp) {
//     // @ts-ignore
//     return `${chalk["gray"](`[${timestamp}]`)} ${colors[level](
//       level.toUpperCase().padEnd(8, " "),
//     )} `;
//   },
//   timestampFormatter(date) {
//     return date.toISOString();
//   },
// });

// prefix.apply(log.getLogger("critical"), {
//   format(level, name, timestamp) {
//     // @ts-ignore
//     return chalk["red"]["bold"](`[${timestamp}] ${level} ${name}:`);
//   },
// });

// export default log;

export class CustomLogger implements LoggerService {
  log(message: string) {
    console.debug(message);
  }
  error(message: string, trace: string) {
    console.error(message);
  }
  trace(message: string) {
    console.debug(message);
  }
  warn(message: string) {
    console.warn(message);
  }
  debug(message: string) {
    console.debug(message);
  }
  info(message: string) {
    console.info(message);
  }
  verbose(message: string) {
    console.debug(message);
  }
}

console;
