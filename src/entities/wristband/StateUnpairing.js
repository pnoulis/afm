import { State } from "./State.js";

class Unpairing extends State {
  constructor(wristband) {
    super(wristband);
  }
  togglePair() {
    this.wristband.setState(this.wristband.getPairingState);
    this.wristband.pair();
  }
}

export { Unpairing };
