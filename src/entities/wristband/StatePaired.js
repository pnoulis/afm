import { State } from "./State.js";

class Paired extends State {
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
  unregistered() {
    return this.wristband.supersedeAction();
  }
  unpair() {
    return this.wristband.unregister();
  }
  togglePair() {
    this.wristband.setState(this.wristband.getEmptyState);
    return this.unpair();
  }
}

export { Paired };
