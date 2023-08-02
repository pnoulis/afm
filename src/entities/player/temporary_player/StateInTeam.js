import { State } from "./State.js";

class InTeam extends State {
  constructor(player) {
    super(player);
  }
  pairWristband(pair) {
    return this.player.blockState("pairWristband", true);
  }
  unpairWristband(unpair) {
    return this.player.blockState("unpairWristband", true);
  }
}

export { InTeam };
