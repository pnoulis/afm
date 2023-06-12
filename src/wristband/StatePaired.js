import { State } from "./State.js";

class Paired extends State {
  constructor(wristband) {
    super(wristband);
  }

  togglePairing() {
    console.log(`${this.name} toggle pairing `);
  }
}

export { Paired };
