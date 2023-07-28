import { State } from "./State.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Registered extends State {
  constructor(team) {
    super(team);
  }

  merge(resolve, reject) {
    reject(new aferrs.ERR_STATE_ACTION_BLOCK(this.name, "team", "merge"));
  }
}

export { Registered };
