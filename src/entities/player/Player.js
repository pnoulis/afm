import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Wristband } from "../wristband/index.js";
import { normalize } from "./normalize.js";
import { random } from "./random.js";
import { isObject } from "js_utils/misc";

class Player {
  static random = random;
  static normalize = normalize;
  constructor(player, { createWristband } = {}) {
    player ??= {};
    this.createWristband =
      createWristband ||
      function (wristband) {
        return new Wristband(wristband);
      };
    this.name = player.name || "";
    this.username = player.username || "";
    this.surname = player.surname || "";
    this.email = player.email || "";
    this.password = player.password || "";
    this.wristband = this.createWristband(player.wristband);
    this.state = player.state || "";
  }
}
Player.prototype.fill = function (
  source,
  { state = "", defaultState = "", nulls = false, depth = 0 } = {},
) {
  source ??= {};
  const target = Player.random(
    Player.normalize([this, source], { state, defaultState, nulls }),
  );
  this.name = target.name;
  this.username = target.username;
  this.surname = target.surname;
  this.email = target.email;
  this.password = target.password;
  this.state = target.state;
  if (depth) {
    this.wristband.fill(source.wristband);
  }
  return this;
};
Player.prototype.asObject = function () {
  return {
    name: this.name,
    username: this.username,
    surname: this.surname,
    email: this.email,
    password: this.password,
    wristband: this.wristband.asObject(),
    state: isObject(this.state) ? this.state.name : this.state,
  };
};
Player.prototype.log = function () {
  console.log("------------------------------");
  console.log("username: ", this.username);
  console.log("name: ", this.name);
  console.log("surname: ", this.surname);
  console.log("email: ", this.email);
  console.log("password: ", this.password);
  console.log("state: ", isObject(this.state) ? this.state.name : this.state);
  this.wristband.log();
  console.log("------------------------------");
};

export { Player };
