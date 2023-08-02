import { State } from "./State.js";

class Pairing extends State {
  constructor(wristband) {
    super(wristband);
  }

  scanned(err, response) {
    if (err) {
      return Promise.reject(err);
    } else {
      this.wristband.unsubscribeWristbandScan = null;
      return Promise.resolve(response);
    }
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

  toggle() {
    this.wristband.setState(this.wristband.getUnpairedState);
    return this.wristband.unpair();
  }
}

export { Pairing };
