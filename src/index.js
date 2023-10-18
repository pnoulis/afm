import { ENVIRONMENT } from "agent_factory.shared/config.js";
import { Pipeline } from "js_utils/pipeline";
import {
  parseResponse,
  statisticLogins,
  statisticRegisteredPlayers,
  statisticMergedTeams,
  statisticActivatedPackages,
  statisticProfits,
} from "./middleware/index.js";
import * as routes from "./routes/backend/index.js";
import * as aferrs from "agent_factory.shared/errors.js";
import { LoggerService } from "agent_factory.shared/services/logger/LoggerService.js";
import { createRegistrationService } from "agent_factory.shared/services/backend/createRegistrationService.js";
import { lockWristbandScan } from "./afmachine/lockWristbandScan.js";
import * as creates from "./afmachine/creates.js";
import { AsyncAction, Scheduler } from "./entities/async_action/index.js";
import {
  Wristband,
  LiveWristband,
  ScannableWristband,
  VerifiableWristband,
  RegistableWristband,
} from "./entities/wristband/index.js";
import {
  Player,
  PersistentPlayer,
  TemporaryPlayer,
} from "./entities/player/index.js";
import { Roster } from "./entities/roster/index.js";
import { Team, TemporaryTeam, PersistentTeam } from "./entities/team/index.js";
import { GroupParty } from "./entities/group_party/index.js";
import { Package } from "./entities/package/index.js";
import * as stubRoutes from "./routes/stubs/index.js";
import { delay } from "js_utils/misc";

const registrationService = await createRegistrationService();
function Afmachine() {
  this.clientId = "001";
  this.clientName = "afclient";

  // Services
  this.services = {};
  // cache storage
  if (ENVIRONMENT.RUNTIME === "browser") {
    // this.services.storage = new LocalStorageService();
  } else {
    this.clientId = "001";
  }
  // logging
  this.services.logger = new LoggerService(this.clientId, this.clientName);
  // backend api
  this.services.backend = registrationService;

  // Middleware
  this.middleware = {
    parseResponse,
    statisticLogins,
    statisticRegisteredPlayers,
    statisticMergedTeams,
    statisticActivatedPackages,
    statisticProfits,
  };

  // Pipeline
  this.pipeline = new Pipeline();

  this.pipeline.setBeforeAll(async (context, next) => {
    context.afmachine = this;
    context.session = context.afmachine.services.storage;
    await next();
  });

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
      // this.services.logger.error(err);
      throw err;
    }
    // this.services.logger.debug(context);
    next();
  });

  // entities
  this.Wristband = Wristband;
  this.LiveWristband = LiveWristband;
  this.ScannableWristband = ScannableWristband;
  this.VerifiableWristband = VerifiableWristband;
  this.RegistableWristband = RegistableWristband;
  this.Player = Player;
  this.PersistentPlayer = PersistentPlayer;
  this.TemporaryPlayer = TemporaryPlayer;
  this.Roster = Roster;
  this.Team = Team;
  this.TemporaryTeam = TemporaryTeam;
  this.PersistentTeam = PersistentTeam;
  this.GroupParty = GroupParty;
  this.Package = Package;

  // Routes
  this.addPackage = this.pipeline.route(...routes.addPackage(this));
  this.onAddPackage = this.pipeline.route(...routes.onAddPackage(this));
  this.boot = this.pipeline.route(...routes.boot(this));
  this.getWristbandScan = this.pipeline.route(...routes.getWristbandScan(this));
  this.listPackages = this.pipeline.route(...routes.listPackages(this));
  this.listRegisteredWristbandPlayers = this.pipeline.route(
    ...routes.listRegisteredWristbandPlayers(this),
  );
  this.listTeams = this.pipeline.route(...routes.listTeams(this));
  this.loginPlayer = this.pipeline.route(...routes.loginPlayer(this));
  this.mergeGroupTeam = this.pipeline.route(...routes.mergeGroupTeam(this));
  this.onMergeGroupTeam = this.pipeline.route(...routes.onMergeGroupTeam(this));
  this.mergeTeam = this.pipeline.route(...routes.mergeTeam(this));
  this.onMergeTeam = this.pipeline.route(...routes.onMergeTeam(this));
  this.registerPlayer = this.pipeline.route(...routes.registerPlayer(this));
  this.onRegisterPlayer = this.pipeline.route(...routes.onRegisterPlayer(this));
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
  this.onRemovePackage = this.pipeline.route(...routes.onRemovePackage(this));
  this.searchPlayer = this.pipeline.route(...routes.searchPlayer(this));
  this.startTeam = this.pipeline.route(...routes.startTeam(this));
  this.onStartTeam = this.pipeline.route(...routes.onStartTeam(this));
  this.verifyWristband = this.pipeline.route(...routes.verifyWristband(this));
  this.loginAdmin = this.pipeline.route(...routes.loginAdmin(this));
  this.startSession = this.pipeline.route(...routes.startSession(this));
  this.stopSession = this.pipeline.route(...routes.stopSession(this));
  this.listScoreboardTeams = this.pipeline.route(
    ...routes.listScoreboardTeams(this),
  );
  this.listScoreboardViews = this.pipeline.route(
    ...routes.listScoreboardViews(this),
  );
  this.listScoreboardDevices = this.pipeline.route(
    ...routes.listScoreboardDevices(this),
  );
  this.setScoreboardViews = this.pipeline.route(
    ...routes.setScoreboardViews(this),
  );
  this.listAllPlayers = this.pipeline.route(...routes.listAllPlayers(this));
  this.onScoreboardUpdate = this.pipeline.route(
    ...routes.onScoreboardUpdate(this),
  );
  this.onScoreboardDevicesUpdate = this.pipeline.route(
    ...routes.onScoreboardDevicesUpdate(this),
  );
  this.listDevices = this.pipeline.route(...routes.listDevices(this));
  this.wakeupDevice = this.pipeline.route(...routes.wakeupDevice(this));
  this.shutdownDevice = this.pipeline.route(...routes.shutdownDevice(this));
  this.restartDevice = this.pipeline.route(...routes.restartDevice(this));
  this.registerCashier = this.pipeline.route(...routes.registerCashier(this));
}

Afmachine.prototype.lockWristbandScan = lockWristbandScan;
Afmachine.prototype.createWristband = creates.createWristband;
Afmachine.prototype.createScanableWristband = creates.createScannableWristband;
Afmachine.prototype.createVerifiableWristband =
  creates.createVerifiableWristband;
Afmachine.prototype.createRegistableWristband =
  creates.createRegistableWristband;
Afmachine.prototype.createPlayer = creates.createPlayer;
Afmachine.prototype.createPersistentPlayer = creates.createPersistentPlayer;
Afmachine.prototype.createTemporaryPlayer = creates.createTemporaryPlayer;
Afmachine.prototype.createTeam = creates.createTeam;
Afmachine.prototype.createPersistentTeam = creates.createPersistentTeam;
Afmachine.prototype.createTemporaryTeam = creates.createTemporaryTeam;
Afmachine.prototype.createRoster = creates.createRoster;
Afmachine.prototype.createGroupParty = creates.createGroupParty;
Afmachine.prototype.createPkg = creates.createPkg;

const afmachine = new Afmachine();
export { afmachine, AsyncAction, Scheduler };
export * from "./misc/log.js";
