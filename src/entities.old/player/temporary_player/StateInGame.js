import { State } from "./State.js";
import * as aferrs from "agent_factory.shared/errors.js";

class InGame extends State {
  constructor(player) {
    super(player);
  }

  pairWristband(resolve, reject) {
    reject(
      new aferrs.ERR_STATE_ACTION_BLOCK(
        this.name,
        "TemporaryPlayer",
        "pairWristband",
      ),
    );
  }

  unpairWristband(resolve, reject) {
    reject(
      new aferrs.ERR_STATE_ACTION_BLOCK(
        this.name,
        "TemporaryPlayer",
        "pairWristband",
      ),
    );
  }
}

export { InGame };
