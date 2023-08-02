import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { Playing } from "./StatePlaying.js";
import { Player } from "../Player.js";
import { RegistableWristband } from "../../wristband/index.js";
import * as aferrs from "agent_factory.shared/errors.js";

class PersistentPlayer extends Player {
  constructor(afmachine, player) {
    player ??= {};
    // initialize ancestor
    super({
      ...player,
      wristband: new RegistableWristband(afmachine, player.wristband),
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

PersistentPlayer.prototype.bootstrap = function () {
  this.setState(this.state);
};
PersistentPlayer.prototype.blockState = function (action, async = false) {
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
PersistentPlayer.prototype.register = function () {
  return this.state.register(() =>
    this.afmachine.registerPlayer(this).then((player) => {
      this.fill(player, { state: "registered" });
    }),
  );
};
PersistentPlayer.prototype.pairWristband = function () {
  return this.state.pairWristband(
    () =>
      new Promise((resolve, reject) =>
        this.player.wristband.toggle((err) =>
          err ? reject(err) : resolve(this),
        ),
      ),
  );
};
PersistentPlayer.prototype.unpairWristband = function () {
  return this.state.unpairWristband(
    () =>
      new Promise((resolve, reject) =>
        this.player.wristband.toggle((err) =>
          err ? reject(err) : resolve(this),
        ),
      ),
  );
};

// Stateful
stateful(PersistentPlayer, [
  Unregistered,
  "unregistered",
  Registered,
  "registered",
  InTeam,
  "inTeam",
  Playing,
  "playing",
]);

// Eventful
eventful(PersistentPlayer, ["stateChange", "change"]);

export { PersistentPlayer };
