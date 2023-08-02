import { State } from "./State.js";

class Registered extends State {
  constructor(player) {
    super(player);
  }

  register(register) {
    return this.player.blockState("register", true);
  }

  pairWristband(pair) {
    return pair();
  }
  unpairWristband(unpair) {
    return unpair();
  }
}

export { Registered };
