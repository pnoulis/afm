import { State } from "./State.js";

class Idle extends State {
  constructor(action) {
    super(action);
  }

  run() {
    this.action.setState(this.action.getPendingState);
    this.action.queue[0].action.apply(this.action);
  }
}

export { Idle };
