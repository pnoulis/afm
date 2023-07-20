import { LiveWristband } from "./LiveWristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class GroupPlayerWristband extends LiveWristband {
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
        this.colorCode = wristband.colorCode;
        this.color = wristband.color;
        this.active = wristband.active;
        this.setState(this.getPairedState);
      });
  }
  unpair() {
    return this.unscan();
  }
}

export { GroupPlayerWristband };
