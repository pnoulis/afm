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

  togglePairing() {
    console.log(`${this.name} toggle pairing `);
  }
}

export { Scanned };
