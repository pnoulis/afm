/*
  States: Empty Pairing Paired Registered

  code: 1 -> Trying to pair() a Registered Wristband
  code: 2 -> Trying to unpair() an Empty wristband
  code: 3 -> Trying to unpair() a Registered wristband
  code: 4 -> Trying to register() an Empty wristband
  code: 5 -> Trying to register() a Pairing wristband
  code: 6 -> Trying to unregister() an Empty wristband
  code: 7 -> Trying to unregister() a Pairing wristband
  code: 8 -> Trying to unregister() a Paired Wristband
*/
class WristbandError extends Error {
  constructor({ message = "wristbandError", code = 0, ...cause } = {}) {
    super(message, { cause });
    this.code = code;
  }
}

// States: Idle Pending Resolved Rejected
class AsyncActionError extends Error {
  constructor(code) {
    let message;
    switch (code) {
      case 0:
        message = "trying to reset() a pending AsyncAction";
        break;
      case 1:
      default:
        message = "AsyncAction";
        break;
    }
    super(message);
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
  AsyncActionError,
};
