import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";
import { Wristband } from "../wristband/index.js";
import { normalize } from "./normalize.js";
import { random } from "./random.js";

class Player {
  static random = random;
  static normalize = normalize;

  constructor(player = {}, state = "") {
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
    this.wristband = new Wristband(player.wristband);
    if (player.state || state) {
      this.setState(this.getState(player.state || state));
    }
  }
}

Player.prototype.fill = function fill(source = {}, { state = "", depth = 0 }) {
  Object.assign(this, Player.random(source));
  if (depth) {
    Player.wristband = new Wristband(Wristband.random(source.wristband));
  }
  this.bootstrap(state || source.state);
  this.emit("change");
  return this;
};

Player.prototype.bootstrap = function bootstrap(state) {
  if (state) {
    this.setState(this.getState(state));
  } else if (typeof this.state === "string") {
    this.setState(this.getState(this.state));
  }
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
