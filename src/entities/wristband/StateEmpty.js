import { State } from "./State.js";

class Empty extends State {
  constructor(wristband) {
    super(wristband);
  }

  togglePair() {
    this.wristband.setState(this.wristband.getPairingState);
    this.wristband.pair();
  }
}

export { Empty };
