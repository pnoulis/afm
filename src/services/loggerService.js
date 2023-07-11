import Pino from "pino";
import { ENVIRONMENT } from "../config.js";

const loggerService = new Pino({
  level: ENVIRONMENT.LOGLEVEL,
  name: "afmachine",
  timestamp: Pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  browser: ENVIRONMENT.RUNTIME === "browser" ? { asObject: true } : undefined,
});

export { loggerService };
