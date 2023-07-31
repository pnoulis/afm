import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { areMembersUniqueCb } from "js_utils/misc";
import { Roster } from "../roster/Roster.js";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { Packaged } from "./StatePackaged.js";
import { Playing } from "./StatePlaying.js";
import { Player } from "../player/Player.js";
import { random } from "./random.js";
import { normalize } from "./normalize.js";
import { mapftob } from "./mapftob.js";
import { MIN_TEAM_SIZE } from "agent_factory.shared/constants.js";
import { Scheduler } from "../async_action/index.js";
import * as aferrs from "agent_factory.shared/errors.js";

class Team {
  static random = random;
  static normalize = normalize;
  static mapftob = mapftob;

  constructor(Afmachine, team = {}, roster) {
    // Eventful initialization
    eventful.construct.call(this);
    // Stateful initialization
    stateful.construct.call(this);
    // Agent Factory
    this.Afmachine = Afmachine;
    // Team initialization
    this.name = team.name || "";
    this.roster = roster ?? new Roster(team.roster);
  }
}

Team.prototype.removePlayer = function (player) {
  this.roster.rm(player.username);
  this.emit("change", this);
};

Team.prototype.addPlayer = function (player) {
  try {
    this.roster.set(this.roster.createPlayer(Player.normalize(player)));
    this.emit("change", this);
  } catch (err) {
    throw err;
  }
};

Team.prototype.merge = function () {
  if (!this.name) {
    throw new aferrs.ERR_TEAM_MERGE_MISSING_NAME();
  }

  const paired = this.roster.find(function (player) {
    return player.inState("registered");
  });

  if (!paired || paired.length < MIN_TEAM_SIZE) {
    throw new aferrs.ERR_TEAM_MERGE_INSUFFICIENT_PLAYERS();
  }

  const unpaired = this.roster.find(function (player) {
    return player.wristband.compareStates(function (states, current) {
      return current < states.registered;
    });
  });

  if (unpaired) {
    throw new aferrs.ERR_TEAM_MERGE_UNPAIRED_PLAYERS(
      unpaired.map((p) => p.username),
    );
  }

  let duplicateColor = null;
  if (
    !areMembersUniqueCb(this.roster.asArray(false), function (car, cdr) {
      if (car.wristband.getColorCode() === cdr.wristband.getColorCode()) {
        duplicateColor = car.wristband.getColor();
        return true;
      }
      return false;
    })
  ) {
    throw new aferrs.ERR_TEAM_MERGE_DUPLICATE_COLORS(duplicateColor);
  }
};

Team.prototype.__merge = (function () {
  const schedule = new Scheduler();
  const __action = function () {
    return new Promise((resolve, reject) => {
      if (!this.name) {
        return reject(new aferrs.ERR_TEAM_MERGE_MISSING_NAME());
      }

      const paired = this.roster.find(function (player) {
        return player.inState("registered");
      });

      if (!paired || paired.length < MIN_TEAM_SIZE) {
        return reject(new aferrs.ERR_TEAM_MERGE_INSUFFICIENT_PLAYERS());
      }

      const unpaired = this.roster.find(function (player) {
        return player.wristband.compareStates(function (states, current) {
          return current < states.registered;
        });
      });

      if (unpaired) {
        return reject(
          new aferrs.ERR_TEAM_MERGE_UNPAIRED_PLAYERS(
            unpaired.map((p) => p.username),
          ),
        );
      }

      let duplicateColor = null;
      if (
        !areMembersUniqueCb(this.roster.asArray(false), function (car, cdr) {
          if (car.wristband.getColorCode() === cdr.wristband.getColorCode()) {
            duplicateColor = car.wristband.getColor();
            return true;
          }
          return false;
        })
      ) {
        return reject(
          new aferrs.ERR_TEAM_MERGE_DUPLICATE_COLORS(duplicateColor),
        );
      }

      schedule
        .run(() => this.Afmachine.mergeTeam(this))
        .then(resolve)
        .catch(reject);
    });
  };
  Object.setPrototypeOf(__action, schedule);
  return __action;
})();

Team.prototype.fill = function (source, { state = "", depth = 0 } = {}) {
  source ||= {};
  const team = Team.random(source, 0);
  this.name ||= team.name;
  this.roster.fill(source, { depth });
  return this;
};

Team.prototype.bootstrap = function bootstap(state) {
  this.setState(state || this.state);
};

Team.prototype.mapftob = function () {
  return Team.mapftob(this);
};

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
eventful(Team, ["stateChange", "change"]);

export { Team };
