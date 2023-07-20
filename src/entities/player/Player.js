import { stateful } from "js_utils/stateful";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";
import { Wristband } from "../wristband/index.js";
import { isObject } from "js_utils/misc";

class Player {
  static random(props = {}) {
    return { ...randomPlayer(), ...props };
  }

  static translate(player = {}, state = "") {
    const translated = {
      name: player.name || "",
      username: player.username || "",
      surname: player.surname || "",
      email: player.email || "",
      password: player.password || "",
      wristband: Wristband.translate(player.wristband),
      state: state || isObject(player.state) ? player.state.name : player.state,
    };
    if (translated.state) {
      return translated;
    } else if (player.wristbandMerged) {
      translated.state = "inTeam";
    } else if (translated.wristband.status === "paired") {
      translated.state = "registered";
    } else {
      translated.state = "unregistered";
    }
    return translated;
  }

  constructor(player = {}, state = "") {
    // Stateful initialization
    stateful.construct.call(this);

    // Player initialization
    Object.assign(this, this.translate(player, state));
    this.bootstrap();
  }
}

Player.prototype.fill = function fill(props = {}) {
  Object.assign(this, this.translate(this.random(props)));
  this.bootstrap();
  return this;
};

Player.prototype.bootstrap = function bootstrap() {
  if (typeof this.state === "string") {
    this.setState(this.getState(this.state));
  }
};
Player.prototype.translate = Player.translate;
Player.prototype.random = Player.random;

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

export { Player };
