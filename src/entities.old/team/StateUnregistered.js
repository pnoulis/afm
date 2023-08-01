import { State } from "./State.js";

class Unregistered extends State {
  constructor(team) {
    super(team);
  }

  merge(resolve, reject) {
    this.team.Afmachine.mergeTeam(this.team)
      .then(() => {
        this.team.setState(this.team.getRegisteredState);
        this.team.emit("change");
        resolve(this.team);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  }
}

export { Unregistered };
