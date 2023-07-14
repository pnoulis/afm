import { State } from "./State.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Unregistered extends State {
  constructor(player) {
    super(player);
  }

  register() {
    return this.player.registration.run(this.player).then((res) => {
      this.player.setState(this.player.getRegisteredState);
      return this.player;
    });
  }
  pairWristband() {
    return Promise.reject(
      new aferrs.ERR_STATE_ACTION_BLOCK("Player", this.name, "pairWristband()"),
    );
  }
}

export { Unregistered };
