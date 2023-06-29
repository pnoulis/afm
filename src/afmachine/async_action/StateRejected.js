import { State } from "./State.js";
import { ERR_AA_FIRE_SETTLED } from "./errors.js";

class Rejected extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.timus0 = this.action.options.minTimeRejecting;
    this.action.startCountdown(this.action.options.minTimeRejecting, () => {
      this.action.emit("settled", this.action.response, null);
    });
  }

  fire() {
    throw new ERR_AA_FIRE_SETTLED();
  }

  reset(force) {
    this.action.response = null;
    this.action.setState(this.action.getIdleState);
    return this.action;
  }
}

export { Rejected };
