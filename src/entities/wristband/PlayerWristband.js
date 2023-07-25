import { LiveWristband } from "./LiveWristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class PlayerWristband extends LiveWristband {
  constructor(Afmachine, player = {}, wristband = {}) {
    super(Afmachine, wristband);
    this.player = player;
  }

  pair() {
    return this.scan()
      .then(this.verify.bind(this))
      .then((wristband) => {
        if (wristband.state === "paired") {
          throw new aferrs.ERR_WRISTBAND_BOUND(wristband.number);
        }
        return this.register({
          wristband,
          player: this.player.username,
        }).then((wristband) => {
          this.fill(wristband);
          this.setState(this.getRegisteredState);
        });
      });
  }

  unpair() {
    return this.inState("registered")
      ? this.unregister().then(this.unscan.bind(this))
      : this.unscan();
  }
}

export { PlayerWristband };
