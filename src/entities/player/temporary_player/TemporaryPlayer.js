import { Player } from "../Player.js";
import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";
import { Unregistered } from "./StateUnregistered.js";
import { InTeam } from "./StateInTeam.js";
import { Playing } from "./StatePlaying.js";
import { VerifiableWristband } from "../../wristband/VerifiableWristband.js";
import * as aferrs from "agent_factory.shared/errors.js";

class TemporaryPlayer extends Player {
  constructor(afmachine, player) {
    player ??= {};
    // initialize ancestor
    super({
      ...player,
      wristband: new VerifiableWristband(afmachine, player.wristband),
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

TemporaryPlayer.prototype.bootstrap = function () {
  this.setState(this.state);
};
TemporaryPlayer.prototype.blockState = function (action, async = false) {
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
TemporaryPlayer.prototype.pairWristband = function () {
  return this.state.pairWristband(
    () =>
      new Promise((resolve, reject) =>
        this.player.wristband.toggle((err) =>
          err ? reject(err) : resolve(this),
        ),
      ),
  );
};

TemporaryPlayer.prototype.unpairWristband = function () {
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
stateful(TemporaryPlayer, [
  Unregistered,
  "unregistered",
  InTeam,
  "inTeam",
  Playing,
  "playing",
]);

// Eventful
eventful(TemporaryPlayer, ["stateChange", "change"]);

export { TemporaryPlayer };
