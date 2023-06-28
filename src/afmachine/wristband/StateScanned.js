import { State } from "./State.js";

class Scanned extends State {
  constructor(wristband) {
    super(wristband);
  }

  togglePair() {
    this.wristband.unpair();
    this.wristband.changeState(this.wristband.getPairingState);
  }
}

export { Scanned };
