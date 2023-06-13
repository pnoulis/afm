import { State } from "./State.js";

class Unregistered extends State {
  constructor(player) {
    super(player);
  }

  pairWristband(resolve, reject) {
    this.player.wristband.scan((err, wristband) => {
      if (err) {
        reject(err);
      } else {
        resolve(wristband);
      }
    });
  }
}

export { Unregistered };
