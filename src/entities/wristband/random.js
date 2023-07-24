import { randomInteger } from "js_utils/misc";
import {
  WRISTBAND_COLORS,
  MAX_WRISTBAND_ID,
} from "agent_factory.shared/constants.js";

function random(wristband = {}) {
  return {
    id: wristband.id ?? randomInteger(1, MAX_WRISTBAND_ID),
    color: wristband.color ?? randomInteger(0, WRISTBAND_COLORS.length - 1),
    status: wristband.state ?? "unpaired",
  };
}

export { random };
