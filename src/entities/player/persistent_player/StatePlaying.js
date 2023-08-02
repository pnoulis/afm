import { State } from "./State.js";

class Playing extends State {
  constructor(player) {
    super(player);
  }
  register(register) {
    return this.player.blockState('register', true);
  }
  pairWristband(pair) {
    return this.player.blockState("pairWristband", true);
  }
  unpairWristband(unpair) {
    return this.player.blockState("unpairWristband", true);
  }
}

export { Playing };
