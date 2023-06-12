import { State } from "./State.js";

class Pending extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.action.tminus0 = this.action.options.minTimePending;
  }

  fire(...args) {
    return undefined;
  }

  resolve(response) {
    this.action.startCountdown(this.action.options.minTimePending, () => {
      this.action.changeState(this.action.getResolvedState);
      this.action.state.resolve(response);
    });
  }
  reject() {}
}

export { Pending };
