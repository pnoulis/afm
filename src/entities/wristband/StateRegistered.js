import { State } from "./State.js";

class Registered extends State {
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

  unregistered(err, response) {
    return err ? Promise.reject(err) : Promise.resolve(response);
  }

  toggle() {
    this.wristband.setState(this.wristband.getUnpairedState);
    return this.wristband.unpair();
  }
}

export { Registered };
