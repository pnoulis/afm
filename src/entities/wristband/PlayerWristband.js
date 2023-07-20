import { Wristband } from "./Wristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class PlayerWristband extends Wristband {
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
        return this.register(wristband);
      })
      .then((response) => {
        this.number = response.wristband.number;
        this.color = response.wristband.color;
        this.active = response.wristband.active;
        this.setState(this.getPairedState);
      });
  }
}
export { PlayerWristband };
