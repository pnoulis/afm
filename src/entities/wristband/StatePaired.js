import { State } from "./State.js";

class Paired extends State {
  constructor(wristband) {
    super(wristband);
  }
  togglePair() {
    this.wristband.setState(this.wristband.getUnpairingState);
    this.wristband.unpair();
  }
}

export { Paired };
