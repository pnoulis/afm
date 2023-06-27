import { State } from "./State.js";
import { WristbandError } from "../../misc/errors.js";
import { registerWristband } from "../../routes/backend/routesBackend.js";

class Scanned extends State {
  constructor(wristband) {
    super(wristband);
  }

  scan() {
    this.wristband.constructor.scanHandler(
      new WristbandError({
        message: "wristband.scanned.scan(): wristband is already scanned",
        code: 1,
      })
    );
  }
  verify() {}
  register(player) {
    return registerWristband({
      player,
      wristband: this.wristband,
    }).then((res) => {
      this.wristband.changeState(this.wristband.getPairedState);
    });
  }
  unregister(player) {}
  unpair(player) {}
}

export { Scanned };
