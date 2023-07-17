import { ENVIRONMENT } from "agent_factory.shared/config.js";
import { Pipeline } from "js_utils/pipeline";
import { CreateBackendService } from "agent_factory.shared/services/backend/CreateBackendService.js";
import { LoggerService } from "agent_factory.shared/services/logger/LoggerService.js";
import { LocalStorageService } from "agent_factory.shared/services/client_storage/local_storage/index.js";
import { parseResponse } from "./middleware/backend/parseResponse.js";
import * as aferrs from "agent_factory.shared/errors.js";
import * as routes from "./routes/backend/index.js";
import { lockWristbandScan } from "./afmachine/lockWristbandScan.js";
import { AsyncAction } from "./entities/async_action/AsyncAction.js";
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

let clientId = "";
const clientName = "afclient";

// storage service
let storageService = null;
if (ENVIRONMENT.RUNTIME === "browser") {
  storageService = new LocalStorageService(clientId);
  storageService.start();
  clientId = storageService.masterId;
} else {
  clientId = "node";
}
// logger service
const loggerService = new LoggerService(clientId, clientName);
// backend service
const backendService = new CreateBackendService(clientId);

// Pipeline
const pipeline = new Pipeline();
pipeline.setGlobalLast(function (context, err) {
  // for DEBUG purposes
  loggerService.debug({
    route: context.route,
    req: context.req.payload,
    res: context.res,
  });
  if (Object.hasOwn(context.res, "payload")) {
    context.res = context.res.payload;
  }
  if (err) {
    if (err instanceof aferrs.ERR_UNSUBSCRIBED) {
      throw err;
    } else {
      loggerService.error(err);
      throw err;
    }
  }
});

// Afmachine
const Afmachine = new (function () {
  this.middleware = {
    parseResponse,
  };
  this.services = {
    storage: storageService,
    backend: backendService,
    log: loggerService,
  };

  // entities
  this.Team = Team;
  this.RegularTeam = RegularTeam;
  this.GroupTeam = GroupTeam;
  this.Wristband = Wristband;
  this.PlayerWristband = PlayerWristband;
  this.GroupPlayerWristband = GroupPlayerWristband;
  this.Player = Player;

  // Initializers
  this.createTeam = createTeam.bind(this);
  this.createRegularTeam = createRegularTeam.bind(this);
  this.createGroupTeam = createGroupTeam.bind(this);
  this.createWristband = createWristband.bind(this);
  this.createPlayer = createPlayer.bind(this);
  this.createPlayerWristband = createPlayerWristband.bind(this);
  this.createGroupPlayerWristband = createGroupPlayerWristband.bind(this);

  // non-routes
  this.lockWristbandScan = lockWristbandScan.bind(this);

  // routes
  this.addPackage = pipeline.route(...routes.addPackage.call(this));
  this.boot = pipeline.route(...routes.boot.call(this));
  this.getWristbandScan = pipeline.route(...routes.getWristbandScan.call(this));
  this.listPackages = pipeline.route(...routes.listPackages.call(this));
  this.listPairedWristbandPlayers = pipeline.route(
    ...routes.listPairedWristbandPlayers.call(this),
  );
  this.listTeams = pipeline.route(...routes.listTeams.call(this));
  this.loginPlayer = pipeline.route(...routes.loginPlayer.call(this));
  this.mergeGroupTeam = pipeline.route(...routes.mergeGroupTeam.call(this));
  this.mergeTeam = pipeline.route(...routes.mergeTeam.call(this));
  this.registerPlayer = pipeline.route(...routes.registerPlayer.call(this));
  this.registerWristband = pipeline.route(
    ...routes.registerWristband.call(this),
  );
  this.removePackage = pipeline.route(...routes.removePackage.call(this));
  this.searchPlayer = pipeline.route(...routes.searchPlayer.call(this));
  this.startTeam = pipeline.route(...routes.startTeam.call(this));
  this.unregisterWristband = pipeline.route(
    ...routes.unregisterWristband.call(this),
  );
  this.verifyWristband = pipeline.route(...routes.verifyWristband.call(this));
})();

export { Afmachine, AsyncAction };
