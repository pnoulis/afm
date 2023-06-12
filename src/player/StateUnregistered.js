import { State } from "./State.js";

class Unregistered extends State {
  constructor(player) {
    super(player);
  }

  pairWristband(cb) {
    console.log(`${this.name} pair wristband`);
    this.player.wristband.togglePairing(cb);
  }
  register(form) {
    return this.player.registration.fire(form);
  }
}

export { Unregistered };
