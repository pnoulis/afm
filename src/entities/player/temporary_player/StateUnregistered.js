import { State } from "./State.js";

class Unregistered extends State {
  constructor(player) {
    super(player);
  }

  pairWristband(pair) {
    return pair();
  }
  unpairWristband(unpair) {
    return unpair();
  }
}

export { Unregistered };
