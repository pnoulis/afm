import { describe, it, expect, vi, beforeAll } from "vitest";

/*
  TESTING COMPONENTS
*/
import { addPackage } from "../../../../src/services/backend/api/addPackage.js";

/*
  DEPENDENCIES
 */
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../../../scripts/randomWristband";
import { randomPlayer } from "../../../../scripts/randomPlayer.js";
import { emulateScan } from "../../../../scripts/emulateScan.js";
import { backendClientService } from "../../../../src/services/backend/client.js";
import * as Errors from "../../../../src/misc/errors.js";
import {
  registerPlayer,
  registerWristband,
  mergeTeam,
} from "../../../../src/services/backend/api/index.js";

describe("addPackage", () => {});
