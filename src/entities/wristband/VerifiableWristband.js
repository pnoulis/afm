import { LiveWristband } from "./LiveWristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class VerifiableWristband extends LiveWristband {
  constructor(afmachine, wristband) {
    super(afmachine, wristband);
  }
  pair() {
    return this.scan()
      .then(this.verify.bind(this))
      .then((wristband) => {
        if (wristband.state === "paired") {
          throw new aferrs.ERR_WRISTBAND_BOUND(wristband.id);
        }
        this.fill(wristband, { state: "paired" });
      });
  }
  unpair() {
    return this.unscan();
  }
}

export { VerifiableWristband };
