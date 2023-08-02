import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Team } from "../Team.js";
import { Roster } from "../../roster/index.js";
import { PersistentPlayer } from "../../player/index.js";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { Merged } from "./StateMerged.js";
import { Playing } from "./StatePlaying.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { Scheduler } from "../../async_action/index.js";
import { MIN_TEAM_SIZE } from "agent_factory.shared/constants.js";
import { areMembersUniqueCb } from "js_utils/misc";

class PersistentTeam extends Team {
  // Redefined to ensure constructor.name does not get
  // affected by minification
  static name = "PersistentTeam";
  constructor(afmachine, team) {
    team ??= {};
    super({
      ...team,
      roster: new Roster(team.roster, function (player) {
        return new PersistentPlayer(afmachine, player);
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

PersistentTeam.prototype.bootstrap = function () {
  this.setState(this.state);
};
PersistentTeam.prototype.blockState = function (action, async = false) {
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
PersistentTeam.prototype.merge = (function () {
  return function () {
    this.state.merge(() => {
      const schedule = new Scheduler();
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
          .run(() => this.afmachine.mergeTeam(this))
          .then(() => this.setState(this.getRegisteredState))
          .then(resolve)
          .catch(reject);
      });
    });
  };
})();

PersistentTeam.prototype.removePlayer = function (player) {
  this.state.removePlayer(() => {
    this.roster.rm(player.username) && this.emit("change", this);
  });
};
PersistentTeam.prototype.addPlayer = function (player) {
  this.state.addPlayer(() => {
    this.roster.set(player); // throws error
    this.emit("change", this);
  });
};

// Stateful
stateful(PersistentTeam, [
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
eventful(PersistentTeam, ["stateChange", "change"]);

export { PersistentTeam };
