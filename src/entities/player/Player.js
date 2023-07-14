import { eventful } from "js_utils/eventful";
import { stateful } from "js_utils/stateful";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";
import { PlayerWristband } from "../wristband/index.js";
import { Afmachine } from "../../index.js";
import { AsyncAction } from "../async_action/index.js";

class Player {
  static Afmachine = Afmachine;
  constructor(player = {}) {
    // Stateful initialization
    stateful.construct.call(this);
    // Player initialization
    this.name = player.name || "";
    this.username = player.username || "";
    this.surname = player.surname || "";
    this.email = player.email || "";
    this.password = player.password || "";
    this.wristband = new PlayerWristband(this, player.wristband);
    if (player.inGame) {
      this.setState(this.getInGameState);
    } else if (player.inTeam) {
      this.setState(this.getInTeamState);
    } else if (player.registered) {
      this.setState(this.getRegisteredState);
    } else {
      this.setState(this.getUnregisteredState);
    }
    this.registration = new AsyncAction(Afmachine.registerPlayer);
  }
  register() {
    return this.state.register();
  }
  pairWristband() {
    return this.state.pairWristband();
  }
}

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
eventful(Player, {
  stateChange: [],
});

export { Player };
