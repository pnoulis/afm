import { State } from "./State.js";

class Resolved extends State {
  constructor(action) {
    super(action);
  }

  init() {
    this.tminus0 = this.action.options.minTimeResolving;
  }

  fire(...args) {
    return undefined;
  }

  resolve(response) {
    this.action.startCountdown(this.action.options.minTimeResolving, () => {
      this.action.resolve(response);
      this.action.changeState(this.action.getIdleState);
    });
  }
  reject() {};
}

export { Resolved };
