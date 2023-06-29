import { State } from "./State.js";

class Pairing extends State {
  constructor(wristband) {
    super(wristband);
  }
  togglePair() {
    this.wristband.unpair();
    this.wristband.setState(this.wristband.getEmptyState);
  }
}

export { Pairing };
