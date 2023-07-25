import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";
import { Wristband } from "../wristband/index.js";
import { normalize } from "./normalize.js";
import { random } from "./random.js";
import { mapftob } from "./mapftob.js";

class Player {
  static random = random;
  static normalize = normalize;
  static mapftob = mapftob;

  constructor(player = {}, { state = "", deep = true } = {}) {
    // Eventful initialization
    eventful.construct.call(this);

    // Stateful initialization
    stateful.construct.call(this);

    // Player initialization
    this.name = player.name || "";
    this.username = player.username || "";
    this.surname = player.surname || "";
    this.email = player.email || "";
    this.password = player.password || "";
    if (deep) {
      this.wristband = new Wristband(player.wristband);
    }
    if (state || player.state) {
      this.setState(this.getState(state || player.state));
    }
  }
}

Player.prototype.fill = function fill(
  source = {},
  { state = "", depth = 0 } = {},
) {
  const player = Player.random(source);
  this.name ||= player.name;
  this.username ||= player.username;
  this.surname ||= player.surname;
  this.email ||= player.email;
  this.password ||= player.password;
  if (depth) {
    this.wristband.fill();
  }
  this.bootstrap(state);
  this.emit("change");
  return this;
};

Player.prototype.bootstrap = function bootstrap(state) {
  this.setState(state || this.state);
};

Player.prototype.mapftob = function () {
  return Player.mapftob(this);
};

// Stateful
stateful(Player, [
  Unregistered,
  "unregistered",
  Registered,
  "registered",
  InTeam,
  "inTeam",
  InGame,
  "inGame",
]);

// Eventful
eventful(Player, ["stateChange", "change"]);

export { Player };
