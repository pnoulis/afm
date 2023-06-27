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
      for (let i = 0; i < this.action.resolve.length; i++) {
        this.action.resolve[i](response);
      }
      this.action.resolve = [];
      this.action.reject = [];
      this.action.changeState(this.action.getIdleState);
    });
  }
}

export { Resolved };
