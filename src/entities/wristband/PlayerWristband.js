import { logWristband, logPlayer } from "../../misc/log.js";
import { LiveWristband } from "./LiveWristband.js";

class PlayerWristband extends LiveWristband {
  constructor(Afmachine, player = {}, wristband = {}) {
    super(Afmachine, wristband);
    this.player = player;
  }

  pair() {
    // scan -> FWristband
    // verify -> FWristband
    // register -> FPlayer
    // last -> FWristband.registered
    return this.scan()
      .then(this.verify.bind(this))
      .then((FWristband) =>
        this.register({
          wristband: FWristband,
          player: this.player,
        }),
      )
      .then((FPlayer) => {
        this.fill(FPlayer.wristband, { state: "registered" });
      });
  }

  unpair() {
    // unregister -> FPlayer
    // unscan -> FWristband.unpaired
    return this.inState("registered")
      ? this.unregister().then(this.unscan.bind(this))
      : this.unscan();
  }
}

export { PlayerWristband };
