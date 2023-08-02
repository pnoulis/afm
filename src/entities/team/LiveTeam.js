import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Team } from "./Team.js";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { Merged } from "./StateMerged.js";
import * as aferrs from "agent_factory.shared/errors.js";

class LiveTeam extends Team {
  constructor(afmachine, team) {
    team ??= {};
    super(team);
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    // afmachine
    this.afmachine = afmachine;
    this.roster = team.roster || [];
  }

  fill(...args) {
    super.fill(...args);
    this.bootstrap();
    this.emit("change");
    return this;
  }
}

LiveTeam.prototype.bootstrap = function () {
  this.setState(this.state);
};

// Stateful
stateful(LiveTeam, [
  Unregistered,
  "unregistered",
  Registered,
  "registered",
  Merged,
  "merged",
]);

// Eventful
eventful(LiveTeam, ["stateChange", "change"]);

export { LiveTeam };
