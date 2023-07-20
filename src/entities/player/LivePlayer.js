import { Player } from './Player.js';
import { eventful } from "js_utils/eventful";
import { AsyncAction } from "../async_action/index.js";

class LivePlayer extends Player {
  constructor(Afmachine, player = {}) {
    super(player);

    // Eventful initialization
    eventful.construct.call(this);

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

// Eventful
eventful(Player, ["stateChange", "error"]);

export { LivePlayer };
