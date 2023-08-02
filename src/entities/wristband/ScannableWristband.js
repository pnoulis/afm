import { LiveWristband } from "./LiveWristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class ScannableWristband extends LiveWristband {
  constructor(afmachine, wristband) {
    super(afmachine, wristband);
  }

  pair() {
    return this.scan().then((wristband) => {
      this.fill(wristband, { state: "paired" });
    });
  }

  unpair() {
    return this.unscan();
  }
}

export { ScannableWristband };
