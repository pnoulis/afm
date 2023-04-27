function Log(logger, options) {
  this.logger = logger || {
    debug: (...args) => console.log(...args),
    error: (...args) => console.log(...args),
    info: (...args) => console.log(...args),
  };
}

Log.prototype.levels = {
  trace: 5,
  debug: 4,
  info: 3,
  warn: 2,
  error: 1,
  fatal: 0,
  silent: -1,
};

log.prototype.trace = function trace(...args) {
  this.logger.trace(...args);
};

Log.prototype.debug = function debug(...args) {
  this.logger.debug(...args);
};

Log.prototype.info = function info(...args) {
  this.logger.info(...args);
};

Log.prototype.warn = function warn(...args) {
  this.logger.warn(...args);
};

Log.prototype.error = function error(...args) {
  this.logger.error(...args);
};

Log.prototype.fatal = function fatal(...args) {
  this.logger.fatal(...args);
};

export { Log };
