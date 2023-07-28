import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Unpaired } from "./StateUnpaired.js";
import { Pairing } from "./StatePairing.js";
import { Paired } from "./StatePaired.js";
import { Registered } from "./StateRegistered.js";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";
import { normalize } from "./normalize.js";
import { random } from "./random.js";
import { mapftob } from "./mapftob.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Wristband {
  static random = random;
  static normalize = normalize;
  static mapftob = mapftob;
  static colors = WRISTBAND_COLORS;

  constructor(wristband = {}, state = "") {
    // Eventful initialization
    eventful.construct.call(this);

    // Stateful initialization
    stateful.construct.call(this);

    // Wristband initialization
    this.id = wristband.id ?? null;
    this.color = wristband.color ?? null;
    if (state || wristband.state) {
      this.setState(
        this.getState(
          state || typeof wristband.state === "object"
            ? wristband.state.name
            : wristband.state,
        ),
      );
    }
  }
}
Wristband.prototype.getColorCode = function () {
  return this.color;
};
Wristband.prototype.getColor = function () {
  if (this.color === null) {
    return "";
  } else if (this.color < 0 || this.color >= Wristband.colors.length) {
    throw new aferrs.ERR_WRISTBAND_COLOR_OUT_OF_BOUNDS(this.color);
  } else {
    return Wristband.colors[this.color];
  }
};
Wristband.prototype.fill = function fill(source = {}, { state = "" } = {}) {
  const wristband = Wristband.random(source);
  this.id ??= wristband.id;
  this.color ??= wristband.color;
  this.bootstrap(state);
  this.emit("change");
  return this;
};
Wristband.prototype.bootstrap = function bootstrap(state) {
  this.setState(state || this.state);
};
Wristband.prototype.mapftob = function () {
  return Wristband.mapftob(this);
};

Wristband.prototype.asObject = function () {
  return {
    id: this.id,
    color: this.color,
    state: this.getState().name,
  };
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
