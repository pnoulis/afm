import { LiveWristband } from "./LiveWristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class PlayerWristband extends LiveWristband {
  constructor(Afmachine, player = {}, wristband = {}) {
    super(Afmachine, wristband);
    this.player = player;
    this.registered = false;
  }

  pair() {
    return this.scan()
      .then(this.verify.bind(this))
      .then((wristband) => {
        if (wristband.active) {
          throw new aferrs.ERR_WRISTBAND_BOUND(wristband.number);
        }
        return this.register({
          wristband,
          player: this.player.username,
        });
      })
      .then(({ wristband }) => {
        this.registered = true;
        this.fill(wristband);
        this.setState(this.getPairedState);
      });
  }

  unpair() {
    return this.registered
      ? this.unregister().then(() => {
          this.registered = false;
          return this.unscan();
        })
      : this.unscan();
  }
}

export { PlayerWristband };
