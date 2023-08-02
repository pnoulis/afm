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
import { Scheduler } from "../../async_action/index.js";
import { MIN_TEAM_SIZE } from "agent_factory.shared/constants.js";
import { areMembersUniqueCb } from "js_utils/misc";

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
    // afmachine
    this.afmachine = afmachine;
    if (team.state) {
      this.setState(team.state);
    }
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
TemporaryTeam.prototype.merge = (function () {
  const schedule = new Scheduler();
  const action = function () {
    return this.state.merge(() => {
      return new Promise((resolve, reject) => {
        if (!this.name) {
          return reject(new aferrs.ERR_TEAM_MERGE_MISSING_NAME());
        }

        const paired = this.roster.find(function (player) {
          return player.wristband.inState("paired");
        });

        if (!paired || paired.length < MIN_TEAM_SIZE) {
          return reject(new aferrs.ERR_TEAM_MERGE_INSUFFICIENT_PLAYERS());
        }

        let duplicateColor = null;
        if (
          !areMembersUniqueCb(this.roster.get(), function (car, cdr) {
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
          .run(() => this.afmachine.mergeGroupTeam(this))
          .then(() => this.setState(this.getMergedState))
          .then(resolve)
          .catch(reject);
      });
    });
  };
  Object.setPrototypeOf(action, schedule);
  return action;
})();

// Stateful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
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
  };
})()();

// Eventful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
    eventful(TemporaryTeam, ["stateChange", "change"]);
  };
})()();

export { TemporaryTeam };
