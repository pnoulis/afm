import { eventful } from "js_utils/eventful";
import { Roster } from "../roster/Roster.js";
import { Team, TemporaryTeam } from "../team/index.js";
import {
  distributePlayers,
  distributePlayersRatio,
  calcTeamSize,
} from "agent_factory.shared/utils/misc.js";
import { smallid } from "js_utils/uuid";
import { isObject, isArray, isObjectEmpty } from "js_utils/misc";
import { normalize } from "./normalize.js";
import { random } from "./random.js";
import { extractPlayers } from "../../utils/extractPlayers.js";
import * as aferrs from "agent_factory.shared/errors.js";

class GroupParty {
  static normalize = normalize;
  static random = random;
  constructor(afmachine, groupParty) {
    // Eventful initialization
    eventful.construct.call(this);
    this.afmachine = afmachine;
    this.teams = groupParty || [];
    // this.teams = GroupParty.normalize(groupParty).map(
    //   (team) => new TemporaryTeam(this.afmachine, team),
    // );
    this.size = 0;
    for (let i = 0; i < this.teams.length; i++) {
      this.size += this.teams[i].size;
    }
  }
}

GroupParty.prototype.fill = function (
  source,
  { size = 2, state = "", defaultState = "", nulls = false, depth = 0 } = {},
) {
  source ??= [];
  const target = GroupParty.random(
    GroupParty.normalize([this, source], {
      state,
      defaultState,
      nulls,
      depth,
    }),
    { depth, size },
  );
  this.teams = target.map((team) => new TemporaryTeam(this.afmachine, team));
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
  this.emit("change");
  return this;
};

GroupParty.prototype.distribute = function (ratio = 2) {
  if (this.size === 0) {
    throw new aferrs.ERR_GP_EMPTY("distribute players");
  }
  for (let i = 0; i < this.teams.length; i++) {
    if (this.teams[i].inState("merged")) {
      throw new aferrs.ERR_GP_DISTRIBUTE_MERGED();
    }
  }

  const distributionMap = distributePlayersRatio(this.size, parseInt(ratio));
  const players = Roster.normalize(extractPlayers(this.teams));
  const oldTeams = this.teams.map((t) => t.name);
  for (let i = 0; i < distributionMap.length; i++) {
    this.teams[i] = new TemporaryTeam(this.afmachine).fill();
    this.teams[i].on("change", () => {
      this.size = 0;
      for (let i = 0; i < this.teams.length; i++) {
        this.size += this.teams[i].size;
      }
    });
    if (oldTeams[i]) {
      this.teams[i].name = oldTeams[i];
    }
    for (let y = 0; y < distributionMap[i].length; y++) {
      this.teams[i].roster.set(players.shift());
    }
  }
  this.size = 0;
  for (let i = 0; i < this.teams.length; i++) {
    this.size += this.teams[i].size;
    this.teams[i].emit("change");
  }
  this.emit("change");
  return this;
};

GroupParty.prototype.asObject = function () {
  return {
    size: this.size,
    teams: this.teams.map((t) => t.asObject()),
  };
};

GroupParty.prototype.forEachAsync = async function (cb) {
  for (let i = 0; i < this.teams.length; i++) {
    await cb(this.teams[i]);
  }
};

GroupParty.prototype.removeTeam = function (team) {
  for (let i = 0; i < this.teams.length; i++) {
    if (this.teams[i].name === team.name || this.teams[i].name === team) {
      this.teams.splice(i, 1);
    }
  }
  this.size = 0;
  for (let i = 0; i < this.teams.length; i++) {
    this.size += this.teams[i].size;
  }
  this.emit("change");
};

GroupParty.prototype.addTeam = function (team) {
  this.teams.push(
    new TemporaryTeam(this.afmachine, team).fill(null, { depth: 1 }),
  );

  this.teams.at(-1).on("change", () => {
    this.size = 0;
    for (let i = 0; i < this.teams.length; i++) {
      this.size += this.teams[i].size;
    }
  });
  this.size = 0;
  for (let i = 0; i < this.teams.length; i++) {
    this.size += this.teams[i].size;
  }
  this.emit("change");
};

GroupParty.prototype.register = async function () {
  if (this.teams.length < 1) {
    return Promise.reject(new aferrs.ERR_GP_EMPTY());
  }
  for (let i = 0; i < this.teams.length; i++) {
    if (this.teams[i].inState("merged")) continue;
    await this.teams[i].merge();
  }
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
