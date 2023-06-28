import { State } from "./State.js";
import { ERR_AA_FIRE_SETTLED } from "./errors.js";

class Resolved extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.tminus0 = this.action.options.minTimeResolving;
  }

  fire() {
    throw new ERR_AA_FIRE_SETTLED();
  }

  reset() {
    this.action.response = null;
    this.action.changeState(this.action.getIdleState);
    return this.action;
  }

  resolve(response) {
    this.action.startCountdown(this.action.options.minTimeResolving, () => {
      for (let i = 0; i < this.action.resolve.length; i++) {
        this.action.resolve[i].call(null, response);
      }
      this.action.response = response;
      this.action.resolve = [];
      this.action.reject = [];
    });
  }
}

export { Resolved };
