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

  resolve(err) {
    this.action.startCountdown(this.action.options.minTimeRejecting, () => {
      this.action.reject(err);
      this.action.changeState(this.action.getIdleState);
    });
  }
  reject() {};
}

export { Rejected };
