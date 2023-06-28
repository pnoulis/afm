import { State } from "./State.js";

class Empty extends State {
  constructor(wristband) {
    super(wristband);
  }
  togglePair() {
    this.wristband.pair();
    this.wristband.changeState(this.wristband.getPairingState);
  }
}

export { Empty };
