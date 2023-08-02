import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { normalize } from "./normalize.js";
import { random } from "./random.js";
import { isObject } from "js_utils/misc";
import { Roster } from "../roster/index.js";

class Team {
  static random = random;
  static normalize = normalize;
  constructor(team) {
    team ??= {};
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    this.name = team.name || "";
    this.points = team.points ?? 0;
    this.state = team.state || "";
    this.roster =
      team.roster instanceof Roster ? team.roster : new Roster(team.roster);
  }

  get size() {
    return this.roster.size;
  }
}

Team.prototype.fill = function (
  source,
  { state = "", defaultState = "", nulls = false, size, depth = 0 } = {},
) {
  source ??= {};
  const target = Team.random(
    Team.normalize([this, source], { state, defaultState, nulls }),
  );
  this.name = target.name;
  this.points = target.points;
  this.state = target.state;
  if (depth > 0) {
    this.roster.fill(source.roster, { depth: depth - 1, size, nulls });
  }
  return this;
};

Team.prototype.asObject = function () {
  return {
    name: this.name,
    points: this.points,
    roster: this.roster.asObject(),
    state: isObject(this.state) ? this.state.name : this.state,
  };
};

Team.prototype.log = function () {
  console.log("------------------------------");
  console.log("team: ", this.name);
  console.log("points: ", this.points);
  console.log("state: ", isObject(this.state) ? this.state.name : this.state);
  this.roster.log();
  console.log("------------------------------");
};

class State {
  constructor(wristband) {
    this.wristband = wristband;
  }
}

class New extends State {
  constructor(wristband) {
    super(wristband);
  }
}

// Stateful
(() => {
  let extended = false;
  return () => {
    extended = true;
    stateful(Team, [New, "new"]);
  };
})()();

// Eventful
(() => {
  let extended = false;
  return () => {
    extended = true;
    eventful(Team, ["stateChange", "change"]);
  };
})()();

export { Team };
