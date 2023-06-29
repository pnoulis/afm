import { State } from "./State.js";

class Idle extends State {
  constructor(action) {
    super(action);
  }

  fire(...args) {
    this.action.tminus0 = this.action.options.fireDelay;
    this.action.startCountdown(this.action.options.fireDelay, () => {
      this.action
        .exec(...args)
        .then((res) => {
          this.action.response = res;
          this.action.state.resolve();
        })
        .catch((err) => {
          this.action.response = err;
          this.action.state.resolve();
        });
      this.action.setState(this.action.getPendingState);
    });
  }
}

export { Idle };
