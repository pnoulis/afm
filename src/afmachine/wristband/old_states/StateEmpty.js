import { State } from "./State.js";
import { WristbandError } from "../../misc/errors.js";

class Empty extends State {
  constructor(wristband) {
    super(wristband);
  }

  scan() {
    this.wristband.changeState(this.wristband.getPairingState);
  }
  verify() {}
  register(player) {
    return Promise.reject(
      new WristbandError({
        message:
          "wristband.empty.register(): trying to register an empty wristband",
        code: 2,
      })
    );
  }
  unregister(player) {}
  unpair(player) {}
}

export { Empty };
