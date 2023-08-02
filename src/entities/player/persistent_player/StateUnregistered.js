import { State } from "./State.js";

class Unregistered extends State {
  constructor(player) {
    super(player);
  }

  register(register) {
    return register();
  }

  pairWristband(pair) {
    return this.player.blockState("pairWristband", true);
  }

  unpairWristband(unpair) {
    return this.player.blockState("unpairWristband", true);
  }
}

export { Unregistered };
