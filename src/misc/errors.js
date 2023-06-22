/*
  code: 1 -> Player cannot pair a wristband in <state>
 */
class WristbandError extends Error {
  constructor({ message = "wristbandError", code = 0, ...cause } = {}) {
    super(message, { cause });
    this.code = code;
  }
}

class AfadminClientError extends Error {
  constructor({ message = "AfadminClientError", ...cause }) {
    super(message, { cause });
    this.name = "AfadminClientError";
  }
}

class BackendError extends Error {
  constructor({ topic, ...cause }) {
    super(topic, { cause });
  }
}

class ValidationError extends Error {
  constructor({ message = "ValidationError", ...cause }) {
    super(message, { cause });
    this.statusCode = 400;
    this.statusLabel = "Bad request";
  }
}

class ModelError extends Error {
  constructor({ message = "ModelError", ...cause }) {
    super(message, { cause });
    this.statusCode = 409;
    this.statusLabel = "Conflict";
  }
}

class TimeoutError extends Error {
  constructor({ message = "TimeoutError", ...cause }) {
    super(message, { cause });
    this.statusCode = 408;
    this.statusLabel = "Request Timeout";
  }
}

export {
  AfadminClientError,
  TimeoutError,
  ModelError,
  ValidationError,
  BackendError,
  WristbandError,
};
