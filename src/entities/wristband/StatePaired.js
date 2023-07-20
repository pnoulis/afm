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

export { Paired };
