import { State } from "./State.js";
import * as aferrs from "agent_factory.shared/errors.js";

class InGame extends State {
  constructor(player) {
    super(player);
  }

  register() {
    return Promise.reject(
      new aferrs.ERR_STATE_ACTION_BLOCK("Player", this.name, "register()"),
    );
  }
  pairWristband() {
    return Promise.reject(
      new aferrs.ERR_STATE_ACTION_BLOCK("Player", this.name, "pairWristband()"),
    );
  }
}

export { InGame };
