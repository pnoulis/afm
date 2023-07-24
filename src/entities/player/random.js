import { Wristband } from "../wristband/index.js";
import { generateRandomName } from "js_utils/misc";
import { smallid } from "js_utils/uuid";

function random(player = {}, deep = false) {
  // username = str_str_str
  const username = `${generateRandomName()}_${smallid()}`;
  const [name, surname, password = ""] = username.split("_");
  return {
    username: player.username || username,
    email: player.email || `${surname}@gmail.com`,
    name: player.name || name,
    surname: player.surname || surname,
    password: player.password || password,
    wristband: deep ? Wristband.random() : Wristband.normalize(),
    state: player.state || "unregistered",
  };
}

export { random };
