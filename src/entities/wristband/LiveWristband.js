import { stateful } from "js_utils/stateful";
import { Empty } from "./StateEmpty.js";
import { Pairing } from "./StatePairing.js";
import { Scanned } from "./StateScanned.js";
import { Verified } from "./StateVerified.js";
import { Paired } from "./StatePaired.js";
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";

class Wristband {
  static random(props = {}) {
    return new Wristband({ ...randomWristband(), ...props }, "unpaired");
  }
  static colors = WRISTBAND_COLORS;

  constructor(wristband = {}, state = "") {
    // Stateful initialization
    stateful.construct.call(this);

    // Wristband initialization
    this.number = wristband.number || null;
    this.colorCode = wristband.color || null;
    this.color = this.mapColor("colorCode", this.colorCode);
    this.active = wristband.active ?? false;
    if (state) {
      this.setState(state);
    } else if (this.active) {
      // this.setState("paired");
    } else {
      // this.setState("unpaired");
    }
  }
}

Wristband.prototype.mapColor = mapWristbandColor;

// Stateful
stateful(Wristband, [
  Empty,
  "empty",
  Pairing,
  "pairing",
  Scanned,
  "scanned",
  Verified,
  "verified",
  Paired,
  "paired",
]);

export { Wristband };
