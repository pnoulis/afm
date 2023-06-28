import { State } from "./State.js";
import { ERR_AA_RESET_PENDING } from "./errors.js";

class Pending extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.action.tminus0 = this.action.options.minTimePending;
  }

  reset() {
    throw new ERR_AA_RESET_PENDING();
  }

  resolve(response) {
    this.action.startCountdown(this.action.options.minTimePending, () => {
      this.action.changeState(this.action.getResolvedState);
      this.action.state.resolve(response);
    });
  }
  reject(err) {
    this.action.startCountdown(this.action.options.minTimePending, () => {
      this.action.changeState(this.action.getRejectedState);
      this.action.state.reject(err);
    });
  }
}

export { Pending };
