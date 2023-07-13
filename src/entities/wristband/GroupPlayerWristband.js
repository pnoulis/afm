import { Wristband } from "./Wristband.js";
import * as werrs from "./errors.js";

class GroupPlayerWristband extends Wristband {
  constructor(player = {}, wristband = {}) {
    super(wristband);
    this.player = player;
  }

  pair() {
    return this.scan()
      .then(this.verify.bind(this))
      .then((wristband) => {
        if (wristband.active) {
          throw new werrs.ERR_WRISTBAND_BOUND(wristband.number);
        }
        this.number = wristband.number;
        this.color = wristband.color;
        this.active = wristband.active;
        this.setState(this.getVerifiedState);
      });
  }
}

export { GroupPlayerWristband };
