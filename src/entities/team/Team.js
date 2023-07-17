import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Roster } from "../roster/Roster.js";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { Packaged } from "./StatePackaged.js";
import { Playing } from "./StatePlaying.js";

class Team {
  constructor(Afmachine, team = {}, ...players) {
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    // Agent Factory
    this.Afmachine = Afmachine;
    // Team initialization
    this.name = team.name || "";
    this.roster = new Roster(players);
  }
}

// Stateful
stateful(Team, [
  Unregistered,
  "unregistered",
  Registered,
  "registered",
  Packaged,
  "packaged",
  Playing,
  "playing",
]);

// Eventful
eventful(Team, ["stateChange"]);

export { Team };
