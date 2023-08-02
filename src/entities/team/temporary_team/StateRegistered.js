import { State } from './State.js';

class Registered extends State {
  constructor(team) {
    super(team);
  }
  merge(merge) {
    return this.team.blockState('merge', true);
  }
  addPlayer(add) {
    return add();
  }
  removePlayer(remove) {
    return remove();
  }
}

export { Registered };
