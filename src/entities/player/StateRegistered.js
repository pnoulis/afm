import { State } from "./State.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Registered extends State {
  constructor(player) {
    super(player);
  }
  register() {
    return Promise.reject(
      new aferrs.ERR_STATE_ACTION_BLOCK(this.name, "player", "register"),
    );
  }
  pairWristband(resolve, reject) {
    this.player.wristband.toggle((err) => {
      err ? reject(err) : resolve(this.player);
    });
  }
}

export { Registered };
