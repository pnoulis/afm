import { normalize } from "./normalize.js";
import { random } from "./random.js";

class AFPkg {
  static normalize = normalize;
  static random = random;
  constructor(afpkg) {
    afpkg ??= {};
    this.name = afpkg.name || "";
    this.type = afpkg.type || "";
    this.amount = afpkg.amount ?? 0;
    this.cost = afpkg.cost ?? 0.0;
  }
}

AFPkg.prototype.log = function () {
  console.log("------------------------------");
  console.log("name: ", this.name);
  console.log("type: ", this.type);
  console.log("amount: ", this.amount);
  console.log("cost: ", this.cost);
  console.log("------------------------------");
};
AFPkg.prototype.asObject = function () {
  return {
    name: this.name,
    type: this.type,
    amount: this.amount,
    cost: this.cost,
  };
};

export { AFPkg };
