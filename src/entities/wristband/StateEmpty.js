import { State } from "./State.js";

class Empty extends State {
  constructor(wristband) {
    super(wristband);
  }
  scanned() {
    return this.wristband.supersedeAction();
  }
  verified() {
    return this.wristband.supersedeAction();
  }
  registered(err, response) {
    if (err) {
      return this.wristband.supersedeAction();
    } else {
      return this.unregister(response, false)
        .then(() => this.wristband.supersedeAction())
        .catch(() => this.wristband.supersedeAction());
    }
  }
  unregistered(err) {
    if (err) {
      return Promise.reject(err);
    } else {
      return this.wristband.unscan();
    }
  }
  togglePair() {
    this.wristband.setState(this.wristband.getPairingState);
    return this.wristband.pair();
  }
}

export { Empty };
