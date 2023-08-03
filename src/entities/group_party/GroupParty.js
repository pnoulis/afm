import { eventful } from "js_utils/eventful";
import { Roster } from "../roster/Roster.js";
import { Team, TemporaryTeam } from "../team/index.js";
import {
  distributePlayers,
  calcTeamSize,
} from "agent_factory.shared/utils/misc.js";
import { smallid } from "js_utils/uuid";
import { isObject, isArray } from "js_utils/misc";
import { normalize } from "./normalize.js";
import { random } from "./random.js";

class GroupParty {
  static normalize = normalize;
  static random = random;
  constructor(afmachine, groupParty) {
    groupParty ??= {};
    // Eventful initialization
    eventful.construct.call(this);
    this.afmachine = afmachine;
    this.teams = [];
    // this.teams = new Array(5)
    //   .fill(null)
    //   .map((_) => new Team({ name: smallid() }));
    // this.teams = groupParty.teams ?? isArray(groupParty) ? groupParty : [];
    // this.size = 0;
    // for (let i = 0; i < this.teams.length; i++) {
    //   this.size += this.teams[i].size;
    // }
  }
}

GroupParty.prototype.newFill = function (
  source,
  { size = 2, state = "", defaultState = "", nulls = false, depth = 0 } = {},
) {
  source ??= [];
  size = size > source.length ? size : source.length;
  const target = [];

  for (let i = 0; i < source.length; i++) {
    target.push(
      Team.normalize(source[i], { state, defaultState, nulls, depth }),
    );
  }

  const teamNames = [];
  const players = [];
  for (let i = 0; i < source.length; i++) {
    if (source[i].name) {
      teamNames.push(source[i].name);
      players.push(
        ...(source[i].roster instanceof Roster
          ? source[i].roster.asObject()
          : source[i].roster || []),
      );
    } else if (source[i].teamName) {
      teamNames.push(source[i].teamName);
      players.push(
        ...(source[i].roster instanceof Roster
          ? source[i].roster.asObject()
          : source[i].roster || []),
      );
    } else {
      players.push(source[i]);
    }
  }
};

/**
 * Fill group party
 * @param {Array} source
 * @param {Object} source.team
 * @param {Array} source.team.roster
 */
GroupParty.prototype.fill = function (
  source,
  { state = "", defaultState = "", nulls = false, size = 2, depth = 0 } = {},
) {
  source ??= [];
  let target = [];
  const players = [];
  for (let i = 0; i < source.length; i++) {
    if (Array.isArray(source[i].roster)) {
      players.push(...source[i].roster);
    }
  }
  this.size = players.length > size ? players.length : size;
  if (this.size < 2) {
    this.size = 2;
  }

  target = distributePlayers(this.size).map((team, i) => {
    return new TemporaryTeam(
      this.afmachine,
      Team.normalize(
        [
          this.teams[i],
          {
            ...source[i],
            roster: new Array(team.length).fill(null).map((_) => ({
              username: smallid(),
              ...players.shift(),
            })),
          },
        ],
        {
          state,
          defaultState,
          nulls,
        },
      ),
    ).fill(null, { depth, size: team.length - 1 });
  });
  this.teams = target;

  this.size = 0;
  for (let i = 0; i < this.teams.length; i++) {
    this.size += this.teams[i].size;
    this.teams[i].on("change", () => {
      this.size = 0;
      for (let i = 0; i < this.teams.length; i++) {
        this.size += this.teams[i].size;
      }
    });
  }
  return this;
};

GroupParty.prototype.distribute = function () {
  this.fill(this.teams.map((t) => t.asObject()));
  return this;
};

GroupParty.prototype.asObject = function () {
  return {
    size: this.size,
    teams: this.teams.map((t) => t.asObject()),
  };
};

GroupParty.prototype.log = function ({ depth = 3 } = {}) {
  console.log("------------------------------");
  console.log("players size: ", this.size);
  console.log("teams size: ", this.teams.length);
  if (depth > 0) {
    for (let i = 0; i < this.teams.length; i++) {
      this.teams[i].log({ depth: depth - 1 });
    }
  }
  console.log("------------------------------");
};

// Eventful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
    eventful(GroupParty, ["change"]);
  };
})()();

export { GroupParty };
