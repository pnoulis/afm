import backend from "./backend/backend.js";
import { Cashier } from "./cashier/index.js";
import { Wristband } from "./wristband/index.js";
import { Player } from "./player/index.js";

backend.init();

export { Cashier, backend, Wristband, Player };
