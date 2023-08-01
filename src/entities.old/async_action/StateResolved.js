import { State } from "./State.js";

class Resolved extends State {
  constructor(action) {
    super(action);
  }
}

export { Resolved };
