import { Player } from './Player.js';
import { AsyncAction } from "../async_action/index.js";

class LivePlayer extends Player {
  constructor(Afmachine, player = {}) {
    super(player);

    this.Afmachine = Afmachine;
    this.registration = new AsyncAction(this.Afmachine.registerPlayer);
  }
  register() {
    return this.state.register();
  }
  pairWristband(cb) {
    this.state.pairWristband(cb);
  }
}


export { LivePlayer };
