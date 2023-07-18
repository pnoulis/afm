import { eventful } from "js_utils/eventful";
import { stateful } from "js_utils/stateful";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";
import { AsyncAction } from "../async_action/index.js";
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";

class Player {
  static random(props = {}) {
    return {
      ...randomPlayer(),
      ...props,
    };
  }
  constructor(Afmachine, player = {}) {
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    // Agent Factory
    this.Afmachine = Afmachine;
    // Player initialization
    this.name = player.name || "";
    this.username = player.username || "";
    this.surname = player.surname || "";
    this.email = player.email || "";
    this.password = player.password || "";
    this.wristband = this.Afmachine.createPlayerWristband(
      this,
      player.wristband,
    );
    if (player.inGame) {
      this.setState(this.getInGameState);
    } else if (player.inTeam) {
      this.setState(this.getInTeamState);
    } else if (player.registered) {
      this.setState(this.getRegisteredState);
    } else {
      this.setState(this.getUnregisteredState);
    }
    this.registration = new AsyncAction(this.Afmachine.registerPlayer);
  }
  register() {
    return this.state.register();
  }
  pairWristband(cb) {
    this.state.pairWristband(cb);
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
eventful(Player, ["stateChange"]);

export { Player };
