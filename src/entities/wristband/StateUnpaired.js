import { State } from "./State.js";

class Unpaired extends State {
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
    return err
      ? this.wristband.supersedeAction()
      : this.unregister(response, false)
          .catch((err) => null)
          .finally(() => this.wristband.supersedeAction());
  }
  unregistered(err) {
    return err ? Promise.reject(err) : Promise.resolve();
  }
  toggle() {
    this.wristband.setState(this.wristband.getPairingState);
    return this.wristband.pair();
  }
}

export { Unpaired };
