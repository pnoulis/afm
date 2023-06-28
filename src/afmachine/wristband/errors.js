class WristbandError extends Error {
  constructor(message) {
    super(message);
    this.name = "WristbandError";
  }
}

class ERR_WRISTBAND_BOUND extends WristbandError {
  constructor(number) {
    super(`Scanned wristband ${number} is bound to another player`);
    this.code = 1;
  }
}

export { ERR_WRISTBAND_BOUND };
