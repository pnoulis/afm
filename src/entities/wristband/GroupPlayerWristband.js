import { Wristband } from "./Wristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class GroupPlayerWristband extends Wristband {
  constructor(Afmachine, player = {}, wristband = {}) {
    super(Afmachine, wristband);
    this.player = player;
  }

  pair() {
    return this.scan()
      .then(this.verify.bind(this))
      .then((wristband) => {
        if (wristband.active) {
          throw new aferrs.ERR_WRISTBAND_BOUND(wristband.number);
        }
        this.number = wristband.number;
        this.color = wristband.color;
        this.active = wristband.active;
        this.setState(this.getVerifiedState);
      });
  }
}

export { GroupPlayerWristband };
