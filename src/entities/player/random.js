import { Wristband } from "../wristband/index.js";
import { generateRandomName } from "js_utils/misc";
import { smallid } from "js_utils/uuid";

function random(source, { depth = 0 } = {}) {
  source ??= {};
  // username = str_str_str
  const username = `${generateRandomName()}_${smallid()}`;
  const [name, surname, password = ""] = username.split("_");
  return {
    username: source.username || username,
    email: source.email || `${surname}@gmail.com`,
    name: source.name || name,
    surname: source.surname || surname,
    password: source.password || password,
    wristband:
      depth > 0
        ? Wristband.random(source.wristband)
        : Wristband.normalize(source.wristband),
    state: source.state || "unregistered",
  };
}

export { random };
