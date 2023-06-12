import { State } from "./State.js";
import * as PlayerErrors from "./errors.js";

class Registered extends State {
  constructor(player) {
    super(player);
  }
  register(form) {
    return Promise.reject(new PlayerErrors.ERR_PLAYER_REGISTERED(this.player));
  }
}

export { Registered };
