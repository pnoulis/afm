import { State } from "./State.js";

class Pairing extends State {
  constructor(wristband) {
    super(wristband);
  }
  togglePair() {
    this.wristband.setState(this.wristband.getEmptyState);
    this.wristband.unpair();
  }
}

export { Pairing };
