import { State } from "./State.js";

class Pairing extends State {
  constructor(wristband) {
    super(wristband);
  }
  scanned(err, response) {
    return err ? Promise.reject(err) : Promise.resolve(response);
  }
  verified(err, response) {
    return err ? Promise.reject(err) : Promise.resolve(response);
  }
  registered(err, response) {
    return err ? Promise.reject(err) : Promise.resolve(response);
  }
  unregistered() {
    return this.wristband.supersedeAction();
  }
  unpair() {
    return this.wristband.unscan();
  }
  togglePair() {
    this.wristband.setState(this.wristband.getEmptyState);
    return this.unpair();
  }
}

export { Pairing };
