import { State } from "./State.js";

class Rejected extends State {
  constructor(action) {
    super(action);
  }
}

export { Rejected };
