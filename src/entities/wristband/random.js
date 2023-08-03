import { randomInteger } from "js_utils/misc";
import {
  WRISTBAND_COLORS,
  MAX_WRISTBAND_ID,
} from "agent_factory.shared/constants.js";

function random(source) {
  source ??= {};
  return {
    id: source.id ?? randomInteger(1, MAX_WRISTBAND_ID),
    color: source.color ?? randomInteger(0, WRISTBAND_COLORS.length - 1),
    state: source.state || "unpaired",
  };
}
export { random };
