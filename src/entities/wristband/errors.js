class WristbandError extends Error {
  constructor(message = "") {
    super(message);
    this.name = "WristbandError";
  }
}

class ERR_WRISTBAND_BOUND extends WristbandError {
  constructor(number) {
    super(`Scanned wristband ${number} is paired to another player`);
    this.code = 1;
  }
}

class ERR_SUPERSEDED_ACTION extends WristbandError {
  constructor() {
    super();
  }
}

export { ERR_WRISTBAND_BOUND, ERR_SUPERSEDED_ACTION };
