import { State } from "./State.js";

class Rejected extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.timus0 = this.action.options.minTimeRejecting;
  }

  fire(...args) {
    return undefined;
  }

  reject(err) {
    this.action.startCountdown(this.action.options.minTimeRejecting, () => {
      for (let i = 0; i < this.action.reject.length; i++) {
        this.action.reject[i].call(null, err);
      }
      this.action.reject = [];
      this.action.resolve = [];
      this.action.changeState(this.action.getIdleState);
    });
  }
}

export { Rejected };
