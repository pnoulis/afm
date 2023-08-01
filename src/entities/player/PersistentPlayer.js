import { Player } from "./Player.js";
import { AsyncAction } from "../async_action/index.js";
import { PlayerWristband } from "../wristband/index.js";

class PersistentPlayer extends Player {
  constructor(Afmachine, player = {}, wristband = {}) {
    super(player, { deep: false });
    this.wristband = new PlayerWristband(Afmachine, this, player.wristband);
    this.Afmachine = Afmachine;
    this.registration = new AsyncAction(this.Afmachine.registerPlayer);
  }

  register() {
    return this.state.register();
  }
  pairWristband() {
    return new Promise((resolve, reject) => {
      this.state.pairWristband(resolve, reject);
    });
  }
  unpairWristband() {
    return new Promise((resolve, reject) => {
      this.state.unpairWristband(resolve, reject);
    });
  }
}

export { PersistentPlayer };
