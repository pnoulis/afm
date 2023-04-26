function Log(logger) {
  this.logger = logger || {
    debug: (...args) => console.log(...args),
    error: (...args) => console.log(...args),
    info: (...args) => console.log(...args),
  };
}

Log.prototype.debug = function debug(...args) {
  this.logger.debug(...args);
};

Log.prototype.error = function error(...args) {
  this.logger.debug(...args);
};

Log.prototype.info = function info(...args) {
  this.logger.info(...args);
};

export { Log };
