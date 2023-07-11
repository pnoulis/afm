import { State } from "./State.js";
import { WristbandError } from "../../misc/errors.js";

class Paired extends State {
  constructor(wristband) {
    super(wristband);
  }

  scan(cb) {
    this.wristband.constructor.scanHandler(
      new WristbandError({
        message: "wristband.paired.scan(): trying to scan a Scanned wristband",
        code: 1,
      })
    );
  }
  verify() {}
  register(player) {
    return Promise.reject(
      new WristbandError({
        message:
          "wristband.paired.register(): trying to register a Paired wristband",
        code: 3,
      })
    );
  }
  unregister(player) {}
  unpair(player) {}
}

export { Paired };
