import { State } from './State.js';

class Registered extends State {
  constructor(team) {
    super(team);
  }
  addPlayer(add) {
    return add();
  }
  removePlayer(remove) {
    return remove();
  }
}

export { Registered };
