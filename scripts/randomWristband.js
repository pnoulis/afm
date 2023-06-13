import { randomInteger } from "js_utils/misc";
import { WRISTBAND_COLORS } from "agent_factory.shared/constants.js";

const ids = [];
let colors = [...WRISTBAND_COLORS];

function randomId() {
  const id = randomInteger(1, 1000);
  if (ids.some((previousId) => previousId === id)) {
    randomId();
  } else {
    ids.push(id);
  }
  return ids.at(-1);
}

function randomColor(uniqueColors = false) {
  let color;
  if (uniqueColors) {
    color = colors.length - 1;
    colors.pop();
  } else {
    color = randomInteger(0, WRISTBAND_COLORS.length - 1);
  }
  return color;
}

function randomWristband(n = 1, uniqueColors = false) {
  colors = [...WRISTBAND_COLORS];
  const maxWristbands = uniqueColors ? WRISTBAND_COLORS.length : n;
  const wristbands = new Array(n <= maxWristbands ? n : maxWristbands - 1)
    .fill(null)
    .map(() => ({
      number: randomId(),
      color: randomColor(uniqueColors),
    }));

  return wristbands.length < 2 ? wristbands.pop() : wristbands;
}

export { randomWristband };
