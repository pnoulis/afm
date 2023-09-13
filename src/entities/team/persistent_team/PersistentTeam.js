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
import { Package } from "../../package/index.js";
import { isObject } from "js_utils/misc";

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
    if (team.state) {
      this.setState(team.state);
    }

    // this.merge = (function () {
    //   const schedule = new Scheduler();
    //   const action = function () {
    //     return schedule.run(() =>
    //       this.state.merge(
    //         () =>
    //           new Promise((resolve, reject) => {
    //             if (!this.name) {
    //               return reject(new aferrs.ERR_TEAM_MERGE_MISSING_NAME());
    //             }

    //             const paired = this.roster.find(function (player) {
    //               return player.inState("registered");
    //             });

    //             if (!paired || paired.length < MIN_TEAM_SIZE) {
    //               return reject(
    //                 new aferrs.ERR_TEAM_MERGE_INSUFFICIENT_PLAYERS(),
    //               );
    //             }

    //             const unpaired = this.roster.find(function (player) {
    //               return player.wristband.compareStates(
    //                 (states, current) => current < states.paired,
    //               );
    //             });

    //             if (unpaired) {
    //               return reject(
    //                 new aferrs.ERR_TEAM_MERGE_UNPAIRED_PLAYERS(
    //                   unpaired.map((p) => p.username),
    //                 ),
    //               );
    //             }

    //             let duplicateColor = null;
    //             if (
    //               !areMembersUniqueCb(this.roster.get(), function (car, cdr) {
    //                 if (
    //                   car.wristband.getColorCode() ===
    //                   cdr.wristband.getColorCode()
    //                 ) {
    //                   duplicateColor = car.wristband.getColor();
    //                   return true;
    //                 }
    //                 return false;
    //               })
    //             ) {
    //               return reject(
    //                 new aferrs.ERR_TEAM_DUPLICATE_WCOLOR(duplicateColor),
    //               );
    //             }

    //             this.afmachine
    //               .mergeTeam(this)
    //               .then(() => {
    //                 return this.setState(this.getMergedState);
    //               })
    //               .then(resolve)
    //               .catch(reject);
    //           }),
    //       ),
    //     );
    //   };
    //   Object.setPrototypeOf(action, schedule);
    //   return action;
    // })();
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
      new aferrs.ERR_STATE_ACTION_BLOCK(this.state.name, "team", action),
    );
  } else {
    throw new aferrs.ERR_STATE_ACTION_BLOCK(this.state.name, "team", action);
  }
};

PersistentTeam.prototype.mergeTeam = function () {
  return this.state.merge(
    () =>
      new Promise((resolve, reject) => {
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
          return player.wristband.compareStates(
            (states, current) => current < states.paired,
          );
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
          !areMembersUniqueCb(this.roster.get(), function (car, cdr) {
            if (car.wristband.getColorCode() === cdr.wristband.getColorCode()) {
              duplicateColor = car.wristband.getColor();
              return true;
            }
            return false;
          })
        ) {
          return reject(new aferrs.ERR_TEAM_DUPLICATE_WCOLOR(duplicateColor));
        }

        this.afmachine
          .mergeTeam(this)
          .then(() => {
            return this.setState(this.getMergedState);
          })
          .then(resolve)
          .catch(reject);
      }),
  );
};

PersistentTeam.prototype.registerPackage = function (pkg) {
  return this.state.registerPackage(
    () =>
      new Promise((resolve, reject) => {
        // return reject(new aferrs.ERR_UNIQUE_ACTIVE_PKG());
        this.afmachine
          .addPackage({
            team: this,
            pkg,
          })
          .then((pkgs) => {
            this.packages = [...pkgs];
            resolve(pkg);
          })
          .catch(reject)
          .finally(() => this.emit("change"));
      }),
  );
};

PersistentTeam.prototype.removePackage = function (pkg) {
  return this.state.removePackage(
    () =>
      new Promise((resolve, reject) => {
        if (pkg.active) {
          return Promise.reject(new aferrs.ERR_RM_ACTIVE_PKG(pkg));
        } else if (
          isObject(pkg.state) ? pkg.inState("new") : pkg.state === "new"
        ) {
          return this.blockState("removePackage", true);
        }

        this.afmachine
          .removePackage({
            team: this,
            pkg,
          })
          .then((pkgs) => {
            this.packages = pkgs.map(
              (p) => new Package(this.afmachine, p, this),
            );
            resolve(pkg, pkgs);
          })
          .catch(reject)
          .finally(() => this.emit("change"));
      }),
  );
};
// PersistentTeam.prototype.merge = (function () {
//   const schedule = new Scheduler();
//   const action = function () {
//     return this.state.merge(() => {
//       return new Promise((resolve, reject) => {
//         if (!this.name) {
//           return reject(new aferrs.ERR_TEAM_MERGE_MISSING_NAME());
//         }

//         const paired = this.roster.find(function (player) {
//           return player.inState("registered");
//         });

//         if (!paired || paired.length < MIN_TEAM_SIZE) {
//           return reject(new aferrs.ERR_TEAM_MERGE_INSUFFICIENT_PLAYERS());
//         }

//         const unpaired = this.roster.find(function (player) {
//           return player.wristband.compareStates(function (states, current) {
//             return current < states.paired;
//           });
//         });

//         if (unpaired) {
//           return reject(
//             new aferrs.ERR_TEAM_MERGE_UNPAIRED_PLAYERS(
//               unpaired.map((p) => p.username),
//             ),
//           );
//         }

//         let duplicateColor = null;
//         if (
//           !areMembersUniqueCb(this.roster.get(), function (car, cdr) {
//             if (car.wristband.getColorCode() === cdr.wristband.getColorCode()) {
//               duplicateColor = car.wristband.getColor();
//               return true;
//             }
//             return false;
//           })
//         ) {
//           return reject(
//             new aferrs.ERR_TEAM_MERGE_DUPLICATE_COLORS(duplicateColor),
//           );
//         }

//         schedule
//           .run(() => this.afmachine.mergeTeam(this))
//           .then(() => this.setState(this.getMergedState))
//           .then(resolve)
//           .catch(reject);
//       });
//     });
//   };
//   Object.setPrototypeOf(action, schedule);
//   return action;
// })();

PersistentTeam.prototype.removePlayer = function (player) {
  this.state.removePlayer(() => {
    this.roster.rm(player.username) && this.emit("change");
  });
};
PersistentTeam.prototype.addPlayer = function (player) {
  this.state.addPlayer(() => {
    // Ensure player uniqueness
    // Ensure player wristband color uniqueness
    this.roster.forEach((seat) => {
      if (seat.username === player.username) {
        throw new aferrs.ERR_TEAM_DUPLICATE_PLAYER(player.username);
      } else if (seat.wristband.color === player.wristband?.color) {
        throw new aferrs.ERR_TEAM_DUPLICATE_WCOLOR(seat.wristband.getColor());
      }
    });
    this.roster.set(player); // throws error
    this.emit("change");
  });
};

// * @param { Object } payload
//  * @param { string } payload.teamName
//    * @param { string } payload.name - The name of a registered package
// PersistentTeam.prototype.registerPackage = (function () {
//   const schedule = new Scheduler();
//   const action = function (pkg) {
//     return this.state.registerPackage(() => {
//       if (this.packages.length > 0) {
//         return Promise.reject(new aferrs.ERR_UNIQUE_ACTIVE_PKG());
//       } else if (pkg instanceof Package) {
//         if (
//           pkg.compareStates((states, current) => {
//             return current >= states.registered;
//           })
//         ) {
//           return Promise.reject(new aferrs.ERR_PKG_IS_REGISTERED(pkg, this));
//         }
//       } else if (pkg.state !== "new") {
//         return Promise.reject(new aferrs.ERR_PKG_IS_REGISTERED(pkg, this));
//       }

//       return new Promise((resolve, reject) => {
//         schedule
//           .run(() =>
//             this.afmachine.addPackage({
//               team: this,
//               pkg,
//             }),
//           )
//           .then((pkgs) => {
//             this.packages = [...pkgs];
//             return pkgs.at(-1);
//           })
//           .then(resolve)
//           .then(() => this.emit("change"))
//           .catch(reject);
//       });
//     });
//   };
//   Object.setPrototypeOf(action, schedule);
//   return action;
// })();

// PersistentTeam.prototype.removePackage = (function () {
//   const schedule = new Scheduler();
//   const action = function (pkg) {
//     return this.state.removePackage(() => {
//       if (pkg.active) {
//         return Promise.reject(new aferrs.ERR_RM_ACTIVE_PKG(pkg));
//       } else if (
//         isObject(pkg.state) ? pkg.inState("new") : pkg.state === "new"
//       ) {
//         return this.blockState("removePackage", true);
//       }

//       return new Promise((resolve, reject) => {
//         schedule
//           .run(() =>
//             this.afmachine.removePackage({
//               team: this,
//               pkg,
//             }),
//           )
//           .then((pkgs) => {
//             this.packages = pkgs.map((p) => new Package(p));
//             return pkgs.at(-1);
//           })
//           .then(resolve)
//           .then(() => this.emit("change"))
//           .catch(reject);
//       });
//     });
//   };
//   Object.setPrototypeOf(action, schedule);
//   return action;
// })();

PersistentTeam.prototype.activate = (function () {
  const schedule = new Scheduler();
  const action = function () {
    return this.state.activate(() => {
      if (!this.packages.length) {
        return Promise.reject(
          new aferrs.ERR_TEAM_ACTIVATE("Cannot activate team with no packages"),
        );
      } else if (this.packages.length > 1) {
        return Promise.reject(
          new aferrs.ERR_TEAM_ACTIVATE(
            `Cannot activate team with more than 1 package.`,
          ),
        );
      } else if (!this.packages.find((pkg) => pkg.state === "registered")) {
        return Promise.reject(
          new aferrs.ERR_TEAM_ACTIVATE(
            "Cannot activate team with no registered packages",
          ),
        );
      }
      return new Promise((resolve, reject) => {
        schedule
          .run(() => this.afmachine.startTeam(this))
          .then((team) => {
            this.setState(this.getPlayingState);
            return team;
          })
          .then(resolve)
          .then(() => this.emit("change"))
          .catch(reject);
      });
    });
  };
  Object.setPrototypeOf(action, schedule);
  return action;
})();

PersistentTeam.prototype.pause = (function () {
  const schedule = new Scheduler();
  const action = function () {
    return this.state.pause(() => {
      if (!this.packages.length) {
        throw new Error("no packages");
      } else if (this.packages.length > 1) {
      } else if (!this.packages.find((pkg) => pkg.state === "registered")) {
        throw new Error("package is not active");
      }
      return new Promise((resolve, reject) => {
        schedule
          .run(() => this.afmachine.startTeam(this))
          .then((team) => {
            this.setState(this.getPlayingState);
            return team;
          })
          .then(resolve)
          .then(() => this.emit("change"))
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
  };
})()();

// Eventful
(() => {
  let extended = false;
  return () => {
    if (extended) return;
    extended = true;
    eventful(PersistentTeam, ["stateChange", "change", "drop"]);
  };
})()();

export { PersistentTeam };
