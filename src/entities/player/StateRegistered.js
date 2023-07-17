import { State } from "./State.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Registered extends State {
  constructor(player) {
    super(player);
  }
  register() {
    return Promise.reject(
      new aferrs.ERR_STATE_ACTION_BLOCK("Player", this.name, "register"),
    );
  }
  pairWristband(cb) {
    this.player.wristband.togglePair(cb);
  }
}

export { Registered };
