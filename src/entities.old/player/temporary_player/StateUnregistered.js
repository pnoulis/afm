import { State } from "./State.js";

class Unregistered extends State {
  constructor(player) {
    super(player);
  }

  pairWristband(resolve, reject) {
    this.player.wristband.toggle((err) => {
      err ? reject(err) : resolve(this.player);
    });
  }
  unpairWristband(resolve, reject) {
    this.player.wristband.toggle((err) => {
      err ? reject(err) : resolve(this.player);
    });
  }
}

export { Unregistered };
