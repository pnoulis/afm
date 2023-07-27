import { ENVIRONMENT } from "agent_factory.shared/config.js";
import { Pipeline } from "js_utils/pipeline";
import { parseResponse } from "./middleware/backend/parseResponse.js";
import * as routes from "./routes/backend/index.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { LoggerService } from "agent_factory.shared/services/logger/LoggerService.js";
import { LocalStorageService } from "agent_factory.shared/services/client_storage/local_storage/index.js";
import { CreateBackendService } from "agent_factory.shared/services/backend/CreateBackendService.js";
import {
  Wristband,
  LiveWristband,
  GroupPlayerWristband,
  PlayerWristband,
} from "./entities/wristband/index.js";
import { Player, PersistentPlayer } from "./entities/player/index.js";
import { Team, RegularTeam, GroupTeam } from "./entities/team/index.js";
import { AsyncAction } from "./entities/async_action/AsyncAction.js";
import {
  createTeam,
  createRegularTeam,
  createGroupTeam,
  createWristband,
  createLiveWristband,
  createPlayerWristband,
  createGroupPlayerWristband,
  createPlayer,
  createPersistentPlayer,
} from "./afmachine/creates.js";
import { lockWristbandScan } from "./afmachine/lockWristbandScan.js";

function Afmachine() {
  this.clientId = "001";
  this.clientName = "afclient";

  // Services
  this.services = {};
  // cache storage
  if (ENVIRONMENT.RUNTIME === "browser") {
    this.services.storage = new LocalStorageService(this.clientId);
    this.services.storage.start();
    this.clientId = this.services.storage.sessionId;
  } else {
    this.clientId = "001";
  }
  // logging
  this.services.logger = new LoggerService(this.clientId, this.clientName);
  // backend api
  this.services.backend = CreateBackendService(this.clientId);

  // Middleware
  this.middleware = {
    parseResponse,
  };

  // Pipeline
  this.pipeline = new Pipeline();
  this.pipeline.setAfterAll(async (context, next, err) => {
    if (err) {
      if (/timeout/.test(err.message)) {
        err = new aferrs.ERR_TIMEOUT();
      }
      // err.context = context;
      context.res = context.res.payload;
      throw err;
    }
    context.res = context.res.payload;
    await next();
  });
  this.pipeline.setGlobalLast((context, next, err) => {
    if (err) {
      this.services.logger.error(err);
      throw err;
    }
    this.services.logger.debug(context);
    next();
  });

  // Entities
  this.Team = Team;
  this.RegularTeam = RegularTeam;
  this.GroupTeam = GroupTeam;
  this.Wristband = Wristband;
  this.LiveWristband = LiveWristband;
  this.GroupPlayerWristband = GroupPlayerWristband;
  this.PlayerWristband = PlayerWristband;
  this.Player = Player;
  this.PersistentPlayer = PersistentPlayer;

  // Routes
  this.addPackage = this.pipeline.route(...routes.addPackage(this));
  this.boot = this.pipeline.route(...routes.boot(this));
  this.getWristbandScan = this.pipeline.route(...routes.getWristbandScan(this));
  this.listPackages = this.pipeline.route(...routes.listPackages(this));
  this.listRegisteredWristbandPlayers = this.pipeline.route(
    ...routes.listRegisteredWristbandPlayers(this),
  );
  this.listTeams = this.pipeline.route(...routes.listTeams(this));
  this.loginPlayer = this.pipeline.route(...routes.loginPlayer(this));
  this.mergeGroupTeam = this.pipeline.route(...routes.mergeGroupTeam(this));
  this.mergeTeam = this.pipeline.route(...routes.mergeTeam(this));
  this.registerPlayer = this.pipeline.route(...routes.registerPlayer(this));
  this.registerWristband = this.pipeline.route(
    ...routes.registerWristband(this),
  );
  this.onRegisterWristband = this.pipeline.route(
    ...routes.onRegisterWristband(this),
  );
  this.unregisterWristband = this.pipeline.route(
    ...routes.unregisterWristband(this),
  );
  this.onUnregisterWristband = this.pipeline.route(
    ...routes.onUnregisterWristband(this),
  );
  this.removePackage = this.pipeline.route(...routes.removePackage(this));
  this.searchPlayer = this.pipeline.route(...routes.searchPlayer(this));
  this.startTeam = this.pipeline.route(...routes.startTeam(this));
  this.verifyWristband = this.pipeline.route(...routes.verifyWristband(this));
}

Afmachine.prototype.createWristband = createWristband;
Afmachine.prototype.createLiveWristband = createLiveWristband;
Afmachine.prototype.createPlayerWristband = createPlayerWristband;
Afmachine.prototype.createGroupPlayerWristband = createGroupPlayerWristband;
Afmachine.prototype.createPlayer = createPlayer;
Afmachine.prototype.createPersistentPlayer = createPersistentPlayer;
Afmachine.prototype.lockWristbandScan = lockWristbandScan;

const afmachine = new Afmachine();
export { afmachine, AsyncAction };
export * from './misc/log.js';
