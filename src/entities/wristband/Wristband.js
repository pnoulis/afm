import { random } from "./random.js";
import { normalize } from "./normalize.js";
import { mapftob } from "./mapftob.js";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";
import { isObject } from "js_utils/misc";
import * as aferrs from "agent_factory.shared/errors.js";

class Wristband {
  static random = random;
  static normalize = normalize;
  static mapftob = mapftob;
  static colors = WRISTBAND_COLORS;

  constructor(wristband = {}) {
    this.id = wristband.id ?? null;
    this.color = wristband.color ?? null;
    this.state = wristband.state || "";
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
Wristband.prototype.fill = function (
  source,
  { state = "", defaultState = "", nulls = false } = {},
) {
  source ??= {};
  const target = Wristband.random(
    Wristband.normalize([this, source], { state, defaultState, nulls }),
  );
  this.id = target.id;
  this.color = target.color;
  this.state = target.state;
  return this;
};
Wristband.prototype.asObject = function () {
  return {
    id: this.id,
    color: this.color,
    state: isObject(this.state) ? this.state.name : this.state,
  };
};
Wristband.prototype.log = function () {
  console.log("id: ", this.id);
  console.log("color: ", this.color);
  console.log("state: ", isObject(this.state) ? this.state.name : this.state);
};

export { Wristband };
