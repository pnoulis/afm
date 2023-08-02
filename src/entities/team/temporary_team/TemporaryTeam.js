import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Team } from "../Team.js";
import { Roster } from "../../roster/index.js";
import { TemporaryPlayer } from "../../player/index.js";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { Merged } from "./StateMerged.js";
import { Playing } from "./StatePlaying.js";
import * as aferrs from "agent_factory.shared/errors.js";

class TemporaryTeam extends Team {
  // Redefined to ensure constructor.name does not get
  // affected by minification
  static name = "TemporaryTeam";
  constructor(afmachine, team) {
    team ??= {};
    super({
      ...team,
      roster: new Roster(team.roster, function (player) {
        return new TemporaryPlayer(afmachine, player);
      }),
    });
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    // afmachine
    this.afmachine = afmachine;
  }

  fill(...args) {
    super.fill(...args);
    this.bootstrap();
    this.emit("change");
    return this;
  }
}
TemporaryTeam.prototype.bootstrap = function () {
  this.setState(this.state);
};
TemporaryTeam.prototype.blockState = function (action, async = false) {
  if (async) {
    return Promise.reject(
      new aferrs.ERR_STATE_ACTION_BLOCK(
        this.state.name,
        this.constructor.name,
        action,
      ),
    );
  } else {
    throw new aferrs.ERR_STATE_ACTION_BLOCK(
      this.state.name,
      this.constructor.name,
      action,
    );
  }
};
TemporaryTeam.prototype.removePlayer = function (player) {
  this.state.removePlayer(() => {
    this.roster.rm(player.username) && this.emit("change", this);
  });
};
TemporaryTeam.prototype.addPlayer = function (player) {
  this.state.addPlayer(() => {
    this.roster.set(player); // throws error
    this.emit("change", this);
  });
};

// Stateful
stateful(TemporaryTeam, [
  Unregistered,
  "unregistered",
  Registered,
  "registered",
  Merged,
  "merged",
  Playing,
  "playing",
]);

// Eventful
eventful(TemporaryTeam, ["stateChange", "change"]);

export { TemporaryTeam };
