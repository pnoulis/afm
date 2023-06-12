import { eventful } from "../eventful.js";
import { stateful } from "../stateful.js";
import { Unregistered } from "./StateUnregistered.js";
import { Registered } from "./StateRegistered.js";
import { InTeam } from "./StateInTeam.js";
import { InGame } from "./StateInGame.js";
import { Wristband } from "../wristband/Wristband.js";
import { register, login } from "../actions.js";

class Player {
  static initialize(player, config) {
    player.name = config.name || "";
    player.username = config.username || "";
    player.email = config.email || "";
    player.password = config.password || "";
    player.wristbandMerged = config.wristbandMerged ?? false;
    player.wristband = new Wristband(config.wristband);

    if (config.inGame) {
      player.setState(player.getInGameState);
    } else if (config.wristbandMerged) {
      player.setState(player.getInTeamState);
    } else if (config.registered) {
      player.setState(player.getRegisteredState);
    } else {
      player.setState(player.getUnregisteredState);
    }
  }

  constructor(player = {}) {
    Object.assign(
      this,
      stateful.call(this, {
        unregistered: new Unregistered(this),
        registered: new Registered(this),
        inTeam: new InTeam(this),
        inGame: new InGame(this),
      })
    );

    Object.assign(
      this,
      eventful.call(this, {
        stateChange: [],
        unregistered: [],
        registered: [],
        inTeam: [],
        inGame: [],
      })
    );
    Player.initialize(this, player);
    this.registration = register();
    this.logination = login();
  }
  changeState(state, cb) {
    const currentState = this.state.name;
    this.setState(state, () => {
      this.emit("stateChange", this.state.name, currentState);
      cb && cb();
    });
  }

  _register() {}

  register(form) {
    return Promise.resolve().then(this.state.register(form));
  }
  unregister() {
    this.state.unregister();
  }
  pairWristband(cb) {
    this.state.pairWristband(cb);
  }
}

export { Player };
