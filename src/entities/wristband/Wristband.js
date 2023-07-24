import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Unpaired } from "./StateUnpaired.js";
import { Pairing } from "./StatePairing.js";
import { Paired } from "./StatePaired.js";
import { Registered } from "./StateRegistered.js";
import { mapWristbandColor } from "agent_factory.shared/utils/misc.js";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";
import { normalize } from "./normalize.js";
import { random } from "./random.js";

class Wristband {
  static mapWristbandColor = mapWristbandColor;
  static colors = WRISTBAND_COLORS;
  static normalize = normalize;
  static random = random;

  constructor(wristband = {}, state = "") {
    // Eventful initialization
    eventful.construct.call(this);

    // Stateful initialization
    stateful.construct.call(this);

    // Wristband initialization
    this.id = wristband.id ?? null;
    this.color = wristband.color ?? null;
    if (wristband.state || state) {
      this.setState(this.getState(wristband.state || state));
    }
  }
}

Wristband.prototype.fill = function fill(source = {}, { state }) {
  Object.assign(this, Wristband.random(source));
  this.bootstrap(state || source.state);
  this.emit("change");
  return this;
};

Wristband.prototype.bootstrap = function bootstrap() {
  if (state) {
    this.setState(this.getState(state));
  } else if (typeof this.state === "string") {
    this.setState(this.getState(this.state));
  }
};

// Stateful
stateful(Wristband, [
  Unpaired,
  "unpaired",
  Pairing,
  "pairing",
  Paired,
  "paired",
  Registered,
  "registered",
]);

// Eventful
eventful(Wristband, ["stateChange", "change"]);

export { Wristband };
