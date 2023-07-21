import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
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

  static translate(player = {}, state = "", depth = true) {
    const translated = {
      name: player.name || "",
      username: player.username || "",
      surname: player.surname || "",
      email: player.email || "",
      password: player.password || "",
      wristband: depth
        ? Wristband.translate(player.wristband || {})
        : player.wristband || {},
      state:
        state || isObject(player.state) ? player.state?.name : player.state,
    };

    if (translated.state) {
      return translated;
    } else if (player.wristbandMerged) {
      translated.state = "inTeam";
    } else if (translated.wristband?.status === "paired") {
      translated.state = "registered";
    } else if (
      "getState" in translated.wristband &&
      translated.wristband.getState().name === "paired"
    ) {
      translated.state = "registered";
    } else {
      translated.state = "unregistered";
    }
    return translated;
  }

  constructor(player = {}, state = "") {
    // Eventful initialization
    eventful.construct.call(this);

    // Stateful initialization
    stateful.construct.call(this);

    // Player initialization
    Object.assign(this, this.translate(player, state, false));
    this.wristband = new Wristband(player.wristband || {});
    this.bootstrap();
  }
}

Player.prototype.fill = function fill(props = {}, depth = false) {
  Object.assign(
    this,
    this.translate(
      { ...this.random(props), wristband: this.wristband },
      null,
      false,
    ),
  );
  this.bootstrap();
  if (depth) {
    this.wristband.fill();
  }
  this.emit("change");
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

// Eventful
eventful(Player, ["stateChange", "change"]);

export { Player };
