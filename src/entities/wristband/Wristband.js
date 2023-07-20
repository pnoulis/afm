import { stateful } from "js_utils/stateful";
import { Unpaired } from "./StateUnpaired.js";
import { Pairing } from "./StatePairing.js";
import { Paired } from "./StatePaired.js";
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";

class Wristband {
  static random(props = {}) {
    return { ...randomWristband(), ...props };
  }
  static translate(wristband) {
    return {
      number: wristband.wristbandNumber ?? wristband.number ?? null,
      colorCode: wristband.wristbandColor ?? wristband.color ?? null,
      color: mapWristbandColor(
        "colorCode",
        wristband.wristbandColor ?? wristband.color,
      ),
      active: wristband.active ?? false,
    };
  }
  static mapColorCode = mapWristbandColor;
  static colors = WRISTBAND_COLORS;

  constructor(wristband = {}, state = "") {
    // Stateful initialization
    stateful.construct.call(this);

    // Wristband initialization
    Object.assign(this, Wristband.translate(wristband));
    if (state) {
      this.setState(state);
    } else if (this.active) {
      this.setState(this.getPairedState);
    } else {
      this.setState(this.getUnpairedState);
    }
  }
}

Wristband.prototype.fill = function fill(props = {}) {
  Object.assign(this, Wristband.translate({ ...Wristband.random(), ...props }));
  return this;
};
Wristband.prototype.translate = Wristband.translate;
Wristband.prototype.mapColor = Wristband.mapColorCode;

// Stateful
stateful(Wristband, [
  Unpaired,
  "unpaired",
  Pairing,
  "pairing",
  Paired,
  "paired",
]);

export { Wristband };
