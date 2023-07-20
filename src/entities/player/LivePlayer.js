import { stateful } from "js_utils/stateful";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";
import { randomPlayer } from "agent_factory.shared/scripts/randomPlayer.js";
import { Wristband } from '../wristband/LiveWristband.js';

class Player {
  static random(props = {}) {
    return new Player({ ...randomPlayer(), ...props }, "unregistered");
  }

  constructor(player = {}, state = "") {
    // Stateful initialization
    stateful.construct.call(this);

    // Player initialization
    this.name = player.name || "";
    this.username = player.username || "";
    this.surname = player.surname || "";
    this.email = player.email || "";
    this.password = player.password || "";
    this.wristbandMerged = player.wristbandMerged ?? false;
    this.wristband = new Wristband(player.wristband);
    if (state) {
      this.setState(state);
    } else if (this.wristbandMerged) {
      this.setState("inTeam");
    } else if (this.wristband.inState("paired")) {
      this.setState("registered");
    } else {
      this.setState("unregistered");
    }
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

export { Player };
