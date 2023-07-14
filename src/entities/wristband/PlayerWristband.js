import { Wristband } from "./Wristband.js";
import * as werrs from "./errors.js";

class PlayerWristband extends Wristband {
  constructor(player = {}, wristband = {}) {
    super(wristband);
    this.player = player;
  }

  pair() {
    return this.scan()
      .then((response) => {
        return response;
      })
      .then(this.verify.bind(this))
      .then((wristband) => {
        if (wristband.active) {
          throw new werrs.ERR_WRISTBAND_BOUND(wristband.number);
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
