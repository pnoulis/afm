import { Wristband } from "./Wristband.js";
import * as werrs from "./errors.js";

class PlayerWristband extends Wristband {
  constructor(player = {}, wristband = {}) {
    super(wristband);
    this.player = player;
  }

  pair() {
    return this.scan()
      .then((response) => {
        return response;
      })
      // .then(this.verify.bind(this))
      .then((wristband) => {
        console.log("RESPONSE ARRIVED");
        console.log(wristband);
      });
    // return this.scan().then(({ number, color, active }) => {
    //   return this.verify(number)
    //     .then(this.register.bind(this, this.player.username, number))
    //     .then(() => {
    //       this.number = number;
    //       this.color = color;
    //       this.active = active ?? false;
    //     })
    //     .catch((err) => {
    //       throw new werrs.ERR_WRISTBAND_BOUND(number);
    //     });
    // });
  }
}
export { PlayerWristband };
