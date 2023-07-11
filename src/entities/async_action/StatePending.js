import { State } from "./State.js";
import { ERR_AA_RESET_PENDING } from "./errors.js";

class Pending extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.action.tminus0 = this.action.options.minTimePending;
  }

  reset(force) {
    if (!force) {
      throw new ERR_AA_RESET_PENDING();
    }
    this.action.response = null;
    this.action.setState(this.action.getIdleState);
    return this.action;
  }

  resolve() {
    this.action.startCountdown(this.action.options.minTimePending, () => {
      this.action.setState(this.action.getResolvedState);
    });
  }
  reject() {
    this.action.startCountdown(this.action.options.minTimePending, () => {
      this.action.setState(this.action.getRejectedState);
    });
  }
}

export { Pending };
