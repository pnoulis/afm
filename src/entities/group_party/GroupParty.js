import { Team, TemporaryTeam } from "../team/index.js";
import {
  distributePlayers,
  calcTeamSize,
} from "agent_factory.shared/utils/misc.js";
import { smallid } from "js_utils/uuid";
import { isObject, isArray } from "js_utils/misc";

class GroupParty {
  static normalize(source, options) {
    if (source instanceof GroupParty) {
      source = source.asObject().teams;
    } else if (isArray(source)) {
      source = source;
    } else if (isObject(source)) {
      source = source.source || [];
    } else {
      source = [];
    }
    const target = [];
    for (let i = 0; i < source.length; i++) {
      target.push(Team.normalize(source[i], options));
    }
    return target;
  }
  constructor(afmachine, groupParty) {
    groupParty ??= {};
    this.afmachine = afmachine;
    this.teams = groupParty;
    this.size = 0;
    for (let i = 0; i < this.teams.length; i++) {
      this.size += this.teams[i].size;
    }
  }
}

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
    ).fill(null, { depth, size: team.length });
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

export { GroupParty };
