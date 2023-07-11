import { State } from "./State.js";

class Paired extends State {
  constructor(wristband) {
    super(wristband);
  }
  togglePair() {
    this.wristband.unpair();
    this.wristband.setState(this.wristband.getUnpairingState);
  }
}

export { Paired };
