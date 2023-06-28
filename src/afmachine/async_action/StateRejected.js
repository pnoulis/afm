import { State } from "./State.js";
import { ERR_AA_FIRE_SETTLED } from "./errors.js";

class Rejected extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.timus0 = this.action.options.minTimeRejecting;
  }

  fire() {
    throw new ERR_AA_FIRE_SETTLED();
  }

  reset() {
    this.action.response = null;
    this.action.changeState(this.action.getIdleState);
    return this.action;
  }

  reject(err) {
    this.action.startCountdown(this.action.options.minTimeRejecting, () => {
      for (let i = 0; i < this.action.reject.length; i++) {
        this.action.reject[i].call(null, err);
      }
      this.action.response = err;
      this.action.reject = [];
      this.action.resolve = [];
    });
  }
}

export { Rejected };
