import { stateful } from "js_utils/stateful";
import { Unpaired } from "./StateUnpaired.js";
import { Pairing } from "./StatePairing.js";
import { Paired } from "./StatePaired.js";
import { randomWristband } from "agent_factory.shared/scripts/randomWristband.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";
import { isObject } from "js_utils/misc";

class Wristband {
  static mapWristbandColor = mapWristbandColor;
  static colors = WRISTBAND_COLORS;

  static random(props = {}) {
    return { ...randomWristband(), ...props };
  }
  static translate(wristband = {}, state = "") {
    const translated = {
      number: wristband.wristbandNumber ?? wristband.number ?? null,
      colorCode:
        wristband.colorCode ??
        wristband.wristbandColor ??
        wristband.color ??
        null,
      color: Wristband.mapWristbandColor(
        "colorCode",
        wristband.colorCode ?? wristband.wristbandColor ?? wristband.color,
      ),
      state:
        state || isObject(wristband.state)
          ? wristband.state.name
          : wristband.state,
    };

    if (translated.state) {
      return translated;
    } else if (wristband.active) {
      translated.state = "paired";
    } else {
      translated.state = "unpaired";
    }
    return translated;
  }

  constructor(wristband = {}, state = "") {
    // Stateful initialization
    stateful.construct.call(this);

    // Wristband initialization
    Object.assign(this, Wristband.translate(wristband, state));
    this.bootstrap();
  }
}

Wristband.prototype.fill = function fill(props = {}) {
  Object.assign(this, this.translate(this.random(props)));
  this.bootstrap();
  return this;
};
Wristband.prototype.bootstrap = function bootstrap() {
  if (typeof this.state === "string") {
    this.setState(this.getState(this.state));
  }
};
Wristband.prototype.translate = Wristband.translate;
Wristband.prototype.random = Wristband.random;
Wristband.prototype.mapWristbandColor = Wristband.mapWristbandColor;

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
