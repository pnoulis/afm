import { stateful } from "js_utils/stateful";
import { eventful } from "js_utils/eventful";

class GroupParty {
  constructor(Afmachine, groupParty = {}) {
    this.teams = new Array(groupParty.size || 1);
    this.name = "";
  }
}

GroupParty.prototype.fill = function (
  source = [],
  { state = "", depth = 0, createPlayer } = {},
) {};

GroupParty.prototype.asObject = function () {};

export { GroupParty };
