import * as aferrs from "agent_factory.shared/errors.js";
import { Pipeline } from "js_utils/pipeline";
import { Team, RegularTeam, GroupTeam } from "./entities/team/index.js";
import {
  Wristband,
  PlayerWristband,
  GroupPlayerWristband,
} from "./entities/wristband/index.js";
import { Player } from "./entities/player/index.js";
import {
  createTeam,
  createRegularTeam,
  createGroupTeam,
  createWristband,
  createPlayer,
  createPlayerWristband,
  createGroupPlayerWristband,
} from "./afmachine/creates.js";
import { lockWristbandScan } from "./lockWristbandScan.js";

class Afmachine {
  constructor(clientId, backendService, loggerService, storageService) {
    this.services = {
      storage: storageService,
      backend: backendService,
      logger: loggerService,
    };

    this.entities = {
      Team,
      RegularTeam,
      GroupTeam,
      Wristband,
      PlayerWristband,
      GroupPlayerWristband,
      Player,
    };

    this.pipeline = new Pipeline();
    this.pipeline.setGlobalLast(function (context, next, err) {
      if (err) {
        if (/timeout/.test(err.message)) {
          err = new aferrs.ERR_TIMEOUT();
        }
        err.context = context;
        throw err;
      }
      next();
    });
  }
}

/* ------------------------------ NON ROUTES ------------------------------ */
Afmachine.prototype.lockWristbandScan = lockWristbandScan;
/* ------------------------------ ROUTES ------------------------------ */
