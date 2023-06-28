import { Wristband } from "./Wristband.js";
import {
  getWristbandScan,
  infoWristband,
  registerWristband,
  unregisterWristband,
} from "../../routes/backend/routesBackend.js";
import { AsyncAction } from "../async_action/index.js";

class WristbandPlayer extends Wristband {
  unpair() {
    this.actionQueue.push({
      target: this.getEmptyState.name,
      recipie: new AsyncAction(() => {
        return unregisterWristband({
          wristband: this,
          player: this.player,
        });
      }),
    });
    this.runActionsQueueUntilEmpty((response) => {
      this.unpaired(response);
    });
  }
  pair() {
    this.actionQueue.push({
      target: this.getPairedState.name,
      recipie: new AsyncAction(() => {
        return getWristbandScan()
          .then(infoWristband)
          .then((info) => {
            if (info.active) {
              throw new Error("wristband active");
            } else {
              return registerWristband({
                wristband: info,
                player: this.player,
              }).then((registered) => {
                return {
                  color: info.color,
                  number: info.number,
                  active: info.active,
                };
              });
            }
          })
          .catch((err) => console.log(err));
      }),
    });
    this.runActionsQueueUntilEmpty((response) => {
      this.paired(response);
      this.changeState(this.getPairedState);
    });
  }
  constructor(player, wristband) {
    super(wristband);
    this.player = player;
  }
}

export { WristbandPlayer };
