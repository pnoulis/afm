import { State } from "./State.js";
import { ERR_AA_FIRE_SETTLED } from "./errors.js";

class Resolved extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.tminus0 = this.action.options.minTimeResolving;
    this.action.startCountdown(this.action.options.minTimeResolving, () => {
      this.action.emit("settled", null, this.action.response);
    });
  }

  fire() {
    throw new ERR_AA_FIRE_SETTLED();
  }

  reset() {
    this.action.response = null;
    this.action.setState(this.action.getIdleState);
    return this.action;
  }
}

export { Resolved };
