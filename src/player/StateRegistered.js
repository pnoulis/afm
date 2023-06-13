import { State } from "./State.js";

class Registered extends State {
  constructor(player) {
    super(player);
  }

  pairWristband() {
    return Promise.resolve('paired wristband');
  }
}

export { Registered };
