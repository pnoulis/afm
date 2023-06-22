import { State } from "./State.js";

class Scanned extends State {
  constructor(wristband) {
    super(wristband);
  }

  init() {
    this.wristband.emit("scanned", {
      number: this.wristband.number,
      color: this.wristband.color,
      active: this.wristband.active,
    });
  }

  scan(cb) {
    // throw error, wristband is scanned already, first need to unpair();
  }
  verify() {}
  register(player) {}
  unregister(player) {}
  unpair(player) {}
}

export { Scanned };
