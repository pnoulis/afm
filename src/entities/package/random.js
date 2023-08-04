import { randomInteger } from "js_utils/misc";
import { AF_PACKAGES } from "agent_factory.shared/constants.js";

function random() {
  return AF_PACKAGES.at(randomInteger(0, AF_PACKAGES.length - 1));
}

export { random };
