import { randomInteger, randomReal } from "js_utils/misc";
import { AF_PACKAGES } from "agent_factory.shared/constants.js";
import { normalize } from "./normalize.js";
import { stoms } from "../../utils/misc.js";

function random(source) {
  source ??= {};
  let target = {};
  target.id = source.id ?? randomInteger(0, 5000);
  target.cost = source.cost ?? randomReal(0, 5000);
  target.type = source.type ?? ["mission", "time"].at(randomInteger(0, 1));
  const availablePkgs = AF_PACKAGES.filter((pkg) => pkg.type === target.type);
  if (availablePkgs.length < 1) {
    throw new Error(`No packages with type: ${target.type}`);
  }
  const selectedpkg = availablePkgs.at(
    randomInteger(0, availablePkgs.length - 1),
  );
  target.name = source.name || selectedpkg.name;
  target.amount = source.amount || selectedpkg.amount;
  target.cost = source.cost || selectedpkg.cost;

  const now = Date.now();
  if (target.type === "missions") {
    if (randomInteger(0, 1) > 0) {
      target.active = true;
      target.t_start = now - stoms(randomInteger(10, 500));
      target.remainder = target.amount - randomInteger(0, target.amount);
    } else {
      target.active = false;
      if (randomInteger(0, 1) > 0) {
        target.t_start = now - stoms(randomInteger(4000, 20000));
        target.t_end = now - stoms(randomInteger(100, 3000));
        target.remainder = 0;
      }
    }
  } else {
    target.amount = stoms(target.amount);
    if (randomInteger(0, 1) > 0) {
      target.active = true;
      target.t_start = now - stoms(randomInteger(10, 500));
    } else {
      target.active = false;
      if (randomInteger(0, 1) > 0) {
        target.t_start = now - stoms(randomInteger(4000, 20000));
        target.t_end = now - stoms(randomInteger(100, 3000));
        target.remainder = 0;
      }
    }
  }
  return target;
}

export { random };
