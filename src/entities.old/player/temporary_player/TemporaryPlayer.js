import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { normalize } from "../normalize.js";
import { random } from "../random.js";
import { mapftob } from "../mapftob.js";
import { GroupPlayerWristband } from "../../wristband/index.js";
import { Unregistered } from "./StateUnregistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";

class TemporaryPlayer {
  static random = random;
  static normalize = normalize;
  static mapftob = mapftob;

  constructor(Afmachine, player = {}, { state = "" } = {}) {
    // Eventful initialization
    eventful.construct.call(this);

    // Stateful initialization
    stateful.construct.call(this);

    this.Afmachine = Afmachine;

    // Player initialization
    this.name = player.name || "";
    this.username = player.username || "";
    this.surname = player.surname || "";
    this.email = player.email || "";
    this.password = player.password || "";
    this.wristband = new GroupPlayerWristband(Afmachine, player.wristband);
    if (state || player.state) {
      this.setState(this.getState(state || player.state));
    }
  }

  pairWristband() {
    return new Promise((resolve, reject) => {
      this.state.pairWristband(resolve, reject);
    });
  }

  unpairWristband() {
    return new Promise((resolve, reject) => {
      this.state.unpairWristband(resolve, reject);
    });
  }
}

TemporaryPlayer.prototype.fill = function fill(
  source,
  { state = "", depth = 0 } = {},
) {
  source ||= {};
  const player = TemporaryPlayer.random(source);
  this.name ||= player.name;
  this.username ||= player.username;
  this.surname ||= player.surname;
  this.email ||= player.email;
  this.password ||= player.password;
  if (depth) {
    this.wristband.fill(source.wristband);
  }
  this.bootstrap(state);
  this.emit("change");
  return this;
};

TemporaryPlayer.prototype.bootstrap = function bootstrap(state) {
  this.setState(state || this.state);
};

TemporaryPlayer.prototype.mapftob = function () {
  return TemporaryPlayer.mapftob(this);
};

TemporaryPlayer.prototype.asObject = function () {
  return {
    name: this.name,
    username: this.username,
    surname: this.surname,
    email: this.email,
    password: this.password,
    wristband: this.wristband.asObject(),
    state: this.getState().name,
  };
};

// Stateful
stateful(TemporaryPlayer, [
  Unregistered,
  "unregistered",
  InTeam,
  "inTeam",
  InGame,
  "inGame",
]);

eventful(TemporaryPlayer, ["stateChange", "change"]);

export { TemporaryPlayer };
