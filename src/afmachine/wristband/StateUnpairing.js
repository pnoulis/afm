import { State } from "./State.js";

class Unpairing extends State {
  constructor(wristband) {
    super(wristband);
  }
  togglePair() {
    this.wristband.pair();
    this.wristband.setState(this.wristband.getPairingState);
  }
}

export { Unpairing };
